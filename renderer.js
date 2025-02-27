/**
 * renderer.js
 *
 * @format
 */

import Calendar from "./components/js/calendar.js"

import {
  loadEvents,
  saveEvents,
  getDateDifferenceText,
} from "./components/js/events.js"
import { renderEvents } from "./components/js/eventsList.js"

document.addEventListener("DOMContentLoaded", () => {
  // Grab form & DOM elements
  const eventNameInput = document.getElementById("event-name")
  const singleDateInput = document.getElementById("single-date")
  const startDateInput = document.getElementById("start-date")
  const endDateInput = document.getElementById("end-date")
  const textColourInput = document.getElementById("text-colour")
  const bgColourInput = document.getElementById("bg-colour")
  const addEventButton = document.getElementById("add-event")
  const eventItemsList = document.getElementById("event-items")
  const singleDateContainer = document.getElementById("single-date-container")
  const multipleDateContainer = document.getElementById(
    "multiple-date-container"
  )
  const eventTypeRadios = document.getElementsByName("event-type")

  // Initialize the Calendar
  const myCalendar = new Calendar("calendar-container")
  myCalendar.render()

  // Highlight today's date in light green
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const todayStr = `${yyyy}-${mm}-${dd}`
  myCalendar.setDateStyle(todayStr, { backgroundColor: "lightgreen" })

  // Show/hide the appropriate date inputs based on event type selection
  eventTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "single" && radio.checked) {
        singleDateContainer.style.display = "block"
        multipleDateContainer.style.display = "none"
      } else if (radio.value === "multiple" && radio.checked) {
        singleDateContainer.style.display = "none"
        multipleDateContainer.style.display = "block"
      }
    })
  })

  // Load existing events from localStorage
  let events = loadEvents()

  // Function to re-render the event list
  function reRenderEvents() {
    renderEvents(events, eventItemsList)
  }

  // Add a new event on button click
  addEventButton.addEventListener("click", () => {
    const selectedType = document.querySelector(
      'input[name="event-type"]:checked'
    ).value
    const newEvent = {
      name: eventNameInput.value,
      type: selectedType,
      textColour: textColourInput.value,
      bgColour: bgColourInput.value,
    }

    if (selectedType === "single") {
      newEvent.date = singleDateInput.value
    } else if (selectedType === "multiple") {
      newEvent.startDate = startDateInput.value
      newEvent.endDate = endDateInput.value
    }

    // Only add event if a name is provided
    if (newEvent.name.trim() !== "") {
      events.push(newEvent)
      saveEvents(events) // save to localStorage
      reRenderEvents() // update the UI

      // Clear input fields
      eventNameInput.value = ""
      singleDateInput.value = ""
      startDateInput.value = ""
      endDateInput.value = ""
    }
  })

  // Live update the countdown text every minute
  setInterval(() => {
    // We can simply re-render the UI since it calls getDateDifferenceText again
    reRenderEvents()
  }, 60000)

  // Initial render on load
  reRenderEvents()

  // --- Side panel logic: Hide/Show the events list ---
  const toggleEventsBtn = document.getElementById("toggle-events-btn")
  const eventsListEl = document.getElementById("events-list")

  toggleEventsBtn.addEventListener("click", () => {
    eventsListEl.classList.toggle("open")
  })

  document.getElementById("event-items").addEventListener("click", () => {
    eventsListEl.classList.remove("open")
  })

  document.addEventListener("click", (e) => {
    const clickInsideList = eventsListEl.contains(e.target)
    const clickToggleBtn = toggleEventsBtn.contains(e.target)
    if (!clickInsideList && !clickToggleBtn) {
      eventsListEl.classList.remove("open")
    }
  })

  // Settings button placeholder
  document.getElementById("settings-btn").addEventListener("click", () => {
    alert("Settings functionality will be implemented in the future.")
  })
})
