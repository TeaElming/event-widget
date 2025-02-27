/**
 * calendar.js
 *
 * @format
 */

export default class Calendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.currentDate = new Date()
    this.currentDate.setDate(1) // keep track of the first day of the current month

    // A simple listener structure so outside elements can set date formatting
    this.dateStyles = {} // { 'YYYY-MM-DD': { color, backgroundColor, etc. }, ... }
  }

  // Public method to set or update styles for a specific date
  setDateStyle(dateString, styleObj) {
    this.dateStyles[dateString] = styleObj
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

  // Calculate and render the month
  render() {
    // Clear the existing content
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
    // Day index [Mon=1 ... Sun=7], but JS uses Sun=0 ... Sat=6
    let startIndex = firstDayOfMonth.getDay() // Sunday=0
    // Convert so Monday=1 ... Sunday=7, adjusting for JS's Sunday=0
    // If it's Sunday (0), we set it to 7, else use the same
    startIndex = startIndex === 0 ? 7 : startIndex

    // We want Monday-based, so if the first day is a Tuesday (which is 2 in JS),
    // startIndex would be 2, meaning we want 1 empty slot if Monday=1.
    // So the number of empty slots before day "1" is (startIndex - 1).
    const emptySlots = startIndex - 1

    // How many days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Render empty slots
    for (let i = 0; i < emptySlots; i++) {
      const emptyDiv = document.createElement("div")
      emptyDiv.classList.add("calendar-day-empty")
      grid.appendChild(emptyDiv)
    }

    // Render actual day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateDiv = document.createElement("div")
      dateDiv.classList.add("calendar-day")

      const fullDateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`
      dateDiv.textContent = day

      // If we have a style in dateStyles, apply it
      if (this.dateStyles[fullDateString]) {
        Object.assign(dateDiv.style, this.dateStyles[fullDateString])
      }

      // Example: If you need a click event
      dateDiv.addEventListener("click", () => {
        console.log("Clicked date:", fullDateString)
      })

      grid.appendChild(dateDiv)
    }

    // Append the grid
    this.container.appendChild(grid)

    // Navigation arrows
    const navContainer = document.createElement("div")
    navContainer.classList.add("calendar-nav")

    const prevBtn = document.createElement("button")
    prevBtn.textContent = "<< Prev"
    prevBtn.onclick = () => this.prevMonth()

    const nextBtn = document.createElement("button")
    nextBtn.textContent = "Next >>"
    nextBtn.onclick = () => this.nextMonth()

    navContainer.appendChild(prevBtn)
    navContainer.appendChild(nextBtn)
    this.container.appendChild(navContainer)
  }
}
