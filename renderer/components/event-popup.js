class EventPopup extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <link rel="stylesheet" href="renderer/components/event-popup.css">
      <dialog id="dlg">
        <h3>Events</h3>
        <ul></ul>
        <button id="close">Close</button>
      </dialog>
    `
    this.shadowRoot.getElementById('close').onclick = () =>
      this.shadowRoot.getElementById('dlg').close()
  }

  setAttribute(name, val) {
    super.setAttribute(name, val)
    if (name === 'events') this.update(JSON.parse(val))
  }

  update(events) {
    const ul = this.shadowRoot.querySelector('ul')
    ul.innerHTML = ''
    events.forEach((ev) => {
      const emoji = ev.emoji || '📅'
      const start = new Date(ev.start).toDateString()
      const end = ev.end ? new Date(ev.end).toDateString() : null
      const range = end ? `${start} → ${end}` : start

      ul.insertAdjacentHTML(
        'beforeend',
        `<li>${emoji} <strong>${ev.name}</strong> – ${range}</li>`
      )
    })
  }

  show() {
    this.shadowRoot.getElementById('dlg').showModal()
  }
}

customElements.define('event-popup', EventPopup)
