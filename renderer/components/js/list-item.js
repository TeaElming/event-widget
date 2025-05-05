import { daysBetween } from '../../date-utils.js'

class ListItem extends HTMLElement {
  static get observedAttributes() {
    return ['event']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const ev = JSON.parse(this.getAttribute('event'))

    const now = new Date()
    const start = new Date(ev.start)
    const end = ev.end ? new Date(ev.end) : start

    const dateLabel = ev.end
      ? `${start.toDateString()} → ${end.toDateString()}`
      : start.toDateString()
    let rel = '*ongoing*'
    if (now < start) rel = `${daysBetween(now, start)} days until start`
    else if (now > end) rel = `${daysBetween(end, now)} days since`

    this.shadowRoot.innerHTML = /*html*/ `
        <link rel="stylesheet" href="renderer/components/css/list-item.css">
        <li style="background:${ev.bgColour || '#fff'}; color:${ev.textColour || '#000'}">
          <strong class="nm">${ev.emoji || '📅'} ${ev.name}</strong>
          <span class="meta">${dateLabel} • ${rel}</span>
          <button class="edit">✎</button>
          <button class="del">✕</button>

          <form class="edit-form">
            <input name="name" value="${ev.name}" />
            <input name="start" type="date" value="${ev.start.slice(0, 10)}" />
            <input name="end" type="date" value="${ev.end ? ev.end.slice(0, 10) : ''}" />
            <input name="emoji" maxlength="2" value="${ev.emoji || ''}" />
            <label class="color-swatch">
              <input name="bgColour" type="color" value="${ev.bgColour || '#ffffff'}" />
            </label>
            <div class="btns">
              <button type="submit" class="save">Save</button>
              <button type="button" class="cancel">Cancel</button>
            </div>
          </form>

        </li>
    `

    const form = this.shadowRoot.querySelector('.edit-form')
    const toggle = (show) => (form.style.display = show ? 'grid' : 'none')
    toggle(false)

    this.shadowRoot.querySelector('.edit').onclick = () => toggle(true)
    this.shadowRoot.querySelector('.cancel').onclick = () => toggle(false)

    this.shadowRoot.querySelector('.del').onclick = () => {
      this.dispatchEvent(
        new CustomEvent('delete-event', {
          bubbles: true,
          detail: ev.id
        })
      )
    }

    form.onsubmit = (e) => {
      e.preventDefault()
      const f = Object.fromEntries(new FormData(form))
      const updated = {
        ...ev,
        name: f.name.trim(),
        emoji: f.emoji,
        textColour: f.textColour,
        bgColour: f.bgColour,
        start: new Date(f.start).toISOString(),
        end: f.end ? new Date(f.end).toISOString() : null
      }
      this.dispatchEvent(
        new CustomEvent('update-event', {
          bubbles: true,
          detail: updated
        })
      )
      toggle(false)
    }
  }
}

customElements.define('list-item', ListItem)
