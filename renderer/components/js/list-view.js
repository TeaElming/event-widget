import './list-item.js'
import './filters-bar.js'

import { loadEvents, saveEvents } from '../../datastore.js'
import { daysBetween, isPast } from '../../date-utils.js'

class ListView extends HTMLElement {
  static get observedAttributes() {
    return ['events']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  attributeChangedCallback() {
    this.render()
  }

  handleEvent(e) {
    if (e.type === 'delete-event') {
      const id = e.detail
      const events = loadEvents().filter((ev) => ev.id !== id)
      saveEvents(events)
      this.dispatchEvent(
        new CustomEvent('events-changed', {
          bubbles: true,
          detail: events
        })
      )
    }

    if (e.type === 'update-event') {
      const updated = e.detail
      const events = loadEvents().map((ev) =>
        ev.id === updated.id ? updated : ev
      )
      saveEvents(events)
      this.dispatchEvent(
        new CustomEvent('events-changed', {
          bubbles: true,
          detail: events
        })
      )
    }

    if (e.type === 'filters-changed') {
      this.filters = e.detail
      this.render()
    }
  }

  render() {
    const all = JSON.parse(this.getAttribute('events') || '[]')
    const f = this.filters || {
      sort: 'added',
      when: 'all',
      search: '',
      range: null
    }

    let list = [...all]

    const today = new Date()

    // --- Filter ---
    if (f.when === 'future') {
      list = list.filter((ev) => !isPast(new Date(ev.start)))
    }
    if (f.when === 'past') {
      list = list.filter((ev) => {
        const end = ev.end ? new Date(ev.end) : new Date(ev.start)
        return isPast(end)
      })
    }

    if (f.search) {
      const q = f.search.toLowerCase()
      list = list.filter((ev) => ev.name.toLowerCase().includes(q))
    }

    if (f.range) {
      const [from, to] = f.range
      list = list.filter((ev) => {
        const s = new Date(ev.start)
        const e = ev.end ? new Date(ev.end) : s
        return s <= to && e >= from
      })
    }

    // --- Sort ---
    if (f.sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    if (f.sort === 'next') {
      list.sort(
        (a, b) =>
          daysBetween(today, new Date(a.start)) -
          daysBetween(today, new Date(b.start))
      )
    }

    // --- HTML ---
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="renderer/components/css/list-view.css">
      <filters-bar></filters-bar>
      <ul class="evt"></ul>`

    const ul = this.shadowRoot.querySelector('.evt')
    list.forEach((ev) => {
      const li = document.createElement('list-item')
      li.setAttribute('event', JSON.stringify(ev))
      ul.appendChild(li)
    })

    this.shadowRoot
      .querySelector('filters-bar')
      .addEventListener('filters-changed', this)

    ul.addEventListener('delete-event', this)
    ul.addEventListener('update-event', this)
  }
}

customElements.define('list-view', ListView)
