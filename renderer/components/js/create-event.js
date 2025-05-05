import { generateId, loadEvents, saveEvents } from '../../datastore.js'

class CreateEvent extends HTMLElement {
  connectedCallback() {
    this.selectedEmoji = '📅' // Default emoji

    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
      <link rel="stylesheet" href="renderer/components/css/create-event.css">
      <form id="frm">
        <input required name="name" placeholder="Event name" />
        <input required name="start" type="date" />
        <input name="end" type="date" />

        <div class="emoji-picker">
          <label>Choose Emoji:</label>
          <div class="emoji-options">
            <button type="button">🎉</button>
            <button type="button">✈️</button>
            <button type="button">🏝️</button>
            <button type="button">📅</button>
            <button type="button">🎂</button>
            <button type="button">💼</button>
            <button type="button">📌</button>
          </div>
        </div>

        <textarea name="desc" rows="2" placeholder="Description (optional)"></textarea>

        <div class="color-row">
          <label class="color-label" title="Background colour">
            <input type="color" name="bgColour" />
          </label>
        </div>

        <button>Add</button>
      </form>
    `

    this.shadowRoot.querySelectorAll('.emoji-options button').forEach((btn) => {
      btn.addEventListener('click', () => this.selectEmoji(btn))
    })

    this.shadowRoot
      .querySelector('#frm')
      .addEventListener('submit', (e) => this.add(e))
  }

  selectEmoji(button) {
    this.selectedEmoji = button.textContent
    this.shadowRoot
      .querySelectorAll('.emoji-options button')
      .forEach((btn) => btn.classList.toggle('selected', btn === button))
  }

  add(e) {
    e.preventDefault()
    const formEl = e.target
    const f = Object.fromEntries(new FormData(formEl))

    const start = new Date(f.start)
    const end = f.end ? new Date(f.end) : null

    if (end && end < start) {
      alert('“End” date must be on or after the “Start” date.')
      return
    }

    const event = {
      id: generateId(),
      name: f.name.trim(),
      emoji: this.selectedEmoji,
      desc: f.desc || '',
      start: start.toISOString(),
      end: end ? end.toISOString() : null,
      bgColour: f.bgColour || '#ffffff'
    }

    const events = loadEvents()
    events.push(event)
    saveEvents(events)

    this.dispatchEvent(
      new CustomEvent('events-changed', {
        bubbles: true,
        detail: events
      })
    )

    formEl.reset()
    this.selectedEmoji = '📅' // Reset to default
    this.shadowRoot
      .querySelectorAll('.emoji-options button')
      .forEach((btn) => btn.classList.remove('selected'))
  }
}

customElements.define('create-event', CreateEvent)
