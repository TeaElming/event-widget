import './day-cell.js'
import './event-popup.js'
import { inRange } from '../../date-utils.js'

class CalendarView extends HTMLElement {
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

  connectedCallback() {
    this.current = new Date()
  }

  render() {
    const events = JSON.parse(this.getAttribute('events') || '[]')
    const monthStart = new Date(
      this.current.getFullYear(),
      this.current.getMonth(),
      1
    )
    const monthEnd = new Date(
      this.current.getFullYear(),
      this.current.getMonth() + 1,
      0
    )
    const weeks = []

    /* Build grid rows (Sun-Sat). Start from Sun before 1st */
    let day = new Date(monthStart)
    day.setDate(day.getDate() - day.getDay())

    while (day <= monthEnd || day.getDay() !== 0) {
      const cells = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(day)
        const todaysEvents = events.filter((ev) =>
          inRange(
            new Date(d),
            new Date(ev.start),
            ev.end ? new Date(ev.end) : new Date(ev.start)
          )
        )
        cells.push({ date: d, events: todaysEvents })
        day.setDate(day.getDate() + 1)
      }
      weeks.push(cells)
    }

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="renderer/components/css/calendar-view.css">
      <header>
        <button id="prev">‹</button>
        <h3>${this.current.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
        <button id="next">›</button>
      </header>
      <div class="grid"></div>
      <event-popup></event-popup>`

    /* grid */
    const grid = this.shadowRoot.querySelector('.grid')
    weeks.forEach((week) => {
      week.forEach((cell) => {
        const el = document.createElement('day-cell')
        el.setAttribute('data', JSON.stringify(cell))
        grid.appendChild(el)
      })
    })

    /* nav */
    this.shadowRoot.getElementById('prev').onclick = () => {
      this.current.setMonth(this.current.getMonth() - 1)
      this.render()
    }
    this.shadowRoot.getElementById('next').onclick = () => {
      this.current.setMonth(this.current.getMonth() + 1)
      this.render()
    }

    /* popup logic */
    grid.addEventListener('open-events', (e) => {
      const popup = this.shadowRoot.querySelector('event-popup')
      popup.setAttribute('events', JSON.stringify(e.detail))
      popup.show()
    })
  }
}
customElements.define('calendar-view', CalendarView)
