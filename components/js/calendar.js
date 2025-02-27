/** @format */

import { loadEvents, getDateDifferenceText } from "./events.js"

export default class Calendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.currentDate = new Date()
    this.currentDate.setDate(1)
    this.dateStyles = {} // { 'YYYY-MM-DD': { color, backgroundColor, etc. }, ... }
    this.events = loadEvents() // Load events from storage
  }

  // Public method to set or update styles for a specific date
  setDateStyle(dateString, styleObj) {
    this.dateStyles[dateString] = styleObj
    this.render()
  }

  // Move to today's date
  goToToday() {
    this.currentDate = new Date() // Reset to today
    this.currentDate.setDate(1) // Keep month view at the first day
    this.render()
  }

  // Move to next month
  nextMonth() {
    const month = this.currentDate.getMonth()
    this.currentDate.setMonth(month + 1)
    this.render()
  }

  // Move to previous month
  prevMonth() {
    const month = this.currentDate.getMonth()
    this.currentDate.setMonth(month - 1)
    this.render()
  }

  // Find events for a specific date
  getEventsForDate(dateStr) {
    return this.events.filter((event) => {
      if (event.type === "single" && event.date === dateStr) return true
      if (event.type === "multiple") {
        if (event.startDate === dateStr) return true
        if (event.endDate === dateStr) return true
        if (event.startDate < dateStr && event.endDate > dateStr) return true
      }
      return false
    })
  }

  // Generate popup text based on event type
  getPopupText(event, dateStr) {
    if (event.type === "single") {
      return `${event.name} ${getDateDifferenceText(event.date)}`
    } else if (event.type === "multiple") {
      const startDiff = getDateDifferenceText(event.startDate)
      const endDiff = getDateDifferenceText(event.endDate)

      if (event.startDate === dateStr) {
        return `${event.name} started ${startDiff} and ends ${endDiff}`
      } else if (event.endDate === dateStr) {
        return `${event.name} ended ${endDiff}`
      } else {
        return `${event.name} is ongoing, ends ${endDiff}`
      }
    }
  }

  // Calculate and render the month
  render() {
    this.container.innerHTML = ""

    // Create header with Month/Year
    const header = document.createElement("div")
    header.classList.add("calendar-header")
    header.textContent = this.currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
    this.container.appendChild(header)

    // Create main calendar grid
    const grid = document.createElement("div")
    grid.classList.add("calendar-grid")

    // Days of the week, starting Monday
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daysOfWeek.forEach((day) => {
      const dayHeader = document.createElement("div")
      dayHeader.classList.add("calendar-day-header")
      dayHeader.textContent = day
      grid.appendChild(dayHeader)
    })

    // Figure out how to position the first day of the month in the Monday-based grid
    const year = this.currentDate.getFullYear()
    const month = this.currentDate.getMonth()

    // Get the first day (1) of current month
    const firstDayOfMonth = new Date(year, month, 1)
    let startIndex = firstDayOfMonth.getDay() // Sunday=0
    startIndex = startIndex === 0 ? 7 : startIndex // Convert Sunday (0) to 7 for Monday-based

    const emptySlots = startIndex - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Render empty slots
    for (let i = 0; i < emptySlots; i++) {
      const emptyDiv = document.createElement("div")
      emptyDiv.classList.add("calendar-day-empty")
      grid.appendChild(emptyDiv)
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

    // Render actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateDiv = document.createElement("div")
      dateDiv.classList.add("calendar-day")

      const fullDateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      dateDiv.textContent = day

      // Highlight today with a green background
      if (fullDateString === todayStr) {
        dateDiv.style.backgroundColor = "lightgreen"
      }

      // Find events for this date
      const eventsOnDate = this.getEventsForDate(fullDateString)

      if (eventsOnDate.length > 0) {
        // Create an indicator container
        const indicator = document.createElement("span")
        indicator.classList.add("event-indicator")

        eventsOnDate.forEach((event) => {
          const eventMarker = document.createElement("span")

          // Assign background color from event.bgColour
          eventMarker.style.color = "red"

          eventMarker.style.padding = "px"
          eventMarker.style.borderRadius = "5px"
          eventMarker.style.marginRight = "3px"

          if (event.type === "single") {
            eventMarker.textContent = " x " // Single-day event
          } else if (event.startDate === fullDateString) {
            eventMarker.textContent = " > " // Start event
          } else if (event.endDate === fullDateString) {
            eventMarker.textContent = " o " // End event
          } else {
            eventMarker.textContent = " - " // Ongoing event
          }

          indicator.appendChild(eventMarker)
        })

        dateDiv.appendChild(indicator)

        // Create a tooltip popup
        const tooltip = document.createElement("div")
        tooltip.classList.add("event-tooltip")
        tooltip.textContent = eventsOnDate
          .map((event) => this.getPopupText(event, fullDateString))
          .join("\n")
        dateDiv.appendChild(tooltip)

        // Show tooltip on hover
        dateDiv.addEventListener("mouseenter", () => {
          tooltip.style.display = "block"
        })
        dateDiv.addEventListener("mouseleave", () => {
          tooltip.style.display = "none"
        })
      }

      grid.appendChild(dateDiv)
    }


    // Append the grid
    this.container.appendChild(grid)

    // Navigation buttons
    const navContainer = document.createElement("div")
    navContainer.classList.add("calendar-nav")

    const prevBtn = document.createElement("button")
    prevBtn.textContent = "<< Prev"
    prevBtn.onclick = () => this.prevMonth()

    const todayBtn = document.createElement("button") // "Today" button
    todayBtn.textContent = "Today"
    todayBtn.onclick = () => this.goToToday()

    const nextBtn = document.createElement("button")
    nextBtn.textContent = "Next >>"
    nextBtn.onclick = () => this.nextMonth()

    navContainer.appendChild(prevBtn)
    navContainer.appendChild(todayBtn)
    navContainer.appendChild(nextBtn)

    this.container.appendChild(navContainer)
  }
}
