/* component imports */
import './components/js/create-event.js'
import './components/js/list-view.js'
import './components/js/calendar-view.js'

import { loadEvents, saveEvents } from './datastore.js'

class CountdownWidget extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.events = loadEvents()
    this.view = 'list' // 'list' | 'calendar'
    this.showForm = false // create-event visibility
  }

  connectedCallback() {
    this.render()
  }

  /* events coming up from children */
  handleEvent(e) {
    if (e.type === 'events-changed') {
      this.events = e.detail
      saveEvents(this.events)
      this.showForm = false // hide form after save/delete
      this.render()
    }
  }

  /* view switcher */
  switchView(view) {
    if (this.view !== view) {
      this.view = view
      this.render()
    }
  }

  /* toggle create-event form */
  toggleForm(show) {
    this.showForm = show ?? !this.showForm
    this.render()
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <link rel="stylesheet" href="renderer/countdown-widget.css">

      <!-- top bar -->
      <nav class="topbar">
        <div class="views">
          <button data-v="list"     class="${this.view === 'list' ? 'on' : ''}">List</button>
          <button data-v="calendar" class="${this.view === 'calendar' ? 'on' : ''}">Calendar</button>
        </div>
        <button class="add-btn" title="Add event">＋</button>
      </nav>

      ${this.showForm ? '<create-event class="creator"></create-event>' : ''}

      ${
        this.view === 'list'
          ? '<list-view></list-view>'
          : '<calendar-view></calendar-view>'
      }
    `

    /* --- listeners --- */
    /* view buttons */
    this.shadowRoot
      .querySelectorAll('.views button')
      .forEach((btn) =>
        btn.addEventListener('click', () => this.switchView(btn.dataset.v))
      )

    /* + button */
    this.shadowRoot
      .querySelector('.add-btn')
      .addEventListener('click', () => this.toggleForm())

    /* pass events to active components */
    if (this.showForm) {
      this.shadowRoot
        .querySelector('create-event')
        ?.setAttribute('events', JSON.stringify(this.events))
    }

    const list = this.shadowRoot.querySelector('list-view')
    if (list) list.setAttribute('events', JSON.stringify(this.events))

    const cal = this.shadowRoot.querySelector('calendar-view')
    if (cal) cal.setAttribute('events', JSON.stringify(this.events))

    /* listen for events-changed bubbling */
    this.shadowRoot
      .querySelectorAll('*')
      .forEach((el) => el.addEventListener('events-changed', this))
  }
}

customElements.define('countdown-widget', CountdownWidget)
