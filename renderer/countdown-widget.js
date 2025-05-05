import './components/js/create-event.js'
import './components/js/list-view.js'
import './components/js/calendar-view.js'
import { loadEvents, saveEvents } from './datastore.js'

class CountdownWidget extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.events = loadEvents()
  }

  connectedCallback() {
    this.render()
  }

  /** Receive updates from child components */
  handleEvent(e) {
    if (e.type === 'events-changed') {
      this.events = e.detail
      saveEvents(this.events)
      this.render() // simple force-update
    }
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <link rel="stylesheet" href="renderer/countdown-widget.css">
      <create-event></create-event>
      <list-view></list-view>
      <calendar-view></calendar-view>
    `

    // pass events ↓
    this.shadowRoot
      .querySelector('create-event')
      .setAttribute('events', JSON.stringify(this.events))
    this.shadowRoot
      .querySelector('list-view')
      .setAttribute('events', JSON.stringify(this.events))
    this.shadowRoot
      .querySelector('calendar-view')
      .setAttribute('events', JSON.stringify(this.events))

    // listen for bubbling custom event
    this.shadowRoot
      .querySelectorAll('*')
      .forEach((el) => el.addEventListener('events-changed', this))
  }
}
customElements.define('countdown-widget', CountdownWidget)
