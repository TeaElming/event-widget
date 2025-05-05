class DayCell extends HTMLElement {
  static get observedAttributes() {
    return ['data']
  }
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  attributeChangedCallback() {
    this.render()
  }
  render() {
    const { date, events } = JSON.parse(this.getAttribute('data'))
    const d = new Date(date)
    const emoji =
      events.length === 1
        ? events[0].emoji || '📅'
        : events.length > 1
          ? '📌'
          : ''
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="renderer/components/day-cell.css">
      <div class="cell ${d.getMonth() === new Date().getMonth() ? '' : 'fade'}">
        <span class="day">${d.getDate()}</span>
        <span class="emoji">${emoji}</span>
      </div>`
    if (events.length) {
      this.shadowRoot.querySelector('.cell').onclick = () =>
        this.dispatchEvent(
          new CustomEvent('open-events', { bubbles: true, detail: events })
        )
    }
  }
}
customElements.define('day-cell', DayCell)
