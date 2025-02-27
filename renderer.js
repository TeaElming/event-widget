/** @format */

import Calendar from "./components/js/calendar.js"
import { loadEvents } from "./components/js/events.js"
import { renderEvents } from "./components/js/eventsList.js"
import { setupAddEvent } from "./components/js/addEvent.js"

document.addEventListener("DOMContentLoaded", () => {
	// Grab Elements
	const eventItemsList = document.getElementById("event-items")
	const eventModal = document.getElementById("event-modal")
	const openEventFormBtn = document.getElementById("open-event-form-btn")
	const closeEventFormBtn = document.getElementById("close-event-form-btn")
	const toggleEventsBtn = document.getElementById("toggle-events-btn") // Missing!
	const eventsListEl = document.getElementById("events-list") // Missing!

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

	// Load existing events from localStorage
	let events = loadEvents()

	// Function to re-render the event list
	function reRenderEvents() {
		renderEvents(events, eventItemsList)
	}

	// Setup event form logic
	setupAddEvent(events, eventItemsList, () => {
		eventModal.classList.remove("show") // Close modal after adding event
	})

	// Open Event Form Modal
	openEventFormBtn.addEventListener("click", () => {
		eventModal.classList.add("show")
	})

	// Close Event Form Modal
	closeEventFormBtn.addEventListener("click", () => {
		eventModal.classList.remove("show")
	})

	// Close modal when clicking outside the modal content
	window.addEventListener("click", (event) => {
		if (event.target === eventModal) {
			eventModal.classList.remove("show")
		}
	})

	// FIX: Add back the "View Events" button toggle logic
	toggleEventsBtn.addEventListener("click", () => {
		eventsListEl.classList.toggle("open") // Slides in/out the event list
	})

	// Close the event list when clicking on an event or outside
	eventItemsList.addEventListener("click", () => {
		eventsListEl.classList.remove("open")
	})

	document.addEventListener("click", (e) => {
		const clickInsideList = eventsListEl.contains(e.target)
		const clickToggleBtn = toggleEventsBtn.contains(e.target)
		if (!clickInsideList && !clickToggleBtn) {
			eventsListEl.classList.remove("open")
		}
	})

	// Initial render on load
	reRenderEvents()
})
