/** @format */

document.addEventListener("DOMContentLoaded", () => {
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

	// Toggle date input containers based on selected event type
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

	// Load events from localStorage
	let events = JSON.parse(localStorage.getItem("events")) || []

	// Save events back to localStorage
	function saveEvents() {
		localStorage.setItem("events", JSON.stringify(events))
	}

	// Helper function to compute the difference in days and return appropriate text
	function getDateDifferenceText(targetDate) {
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		const target = new Date(targetDate)
		target.setHours(0, 0, 0, 0)
		const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
		if (diff > 0) {
			return `${diff} days until`
		} else if (diff < 0) {
			return `${Math.abs(diff)} days since`
		} else {
			return "Today!"
		}
	}

	// Update the display text for an event
	function updateEventDisplay(element, event) {
		let displayText = `Event: ${event.name}`
		if (event.type === "single" && event.date) {
			displayText += ` | ${getDateDifferenceText(event.date)} event`
		} else if (event.type === "multiple") {
			if (event.startDate) {
				displayText += ` | Start: ${getDateDifferenceText(event.startDate)}`
			}
			if (event.endDate) {
				displayText += ` | End: ${getDateDifferenceText(event.endDate)}`
			}
		}
		element.textContent = displayText
	}

	// Create and add an event list item to the UI
	function addEventToList(event, index) {
		const li = document.createElement("li")
		li.style.color = event.textColour
		li.style.backgroundColor = event.bgColour
		li.setAttribute("data-index", index)

		// Create a span to hold the event description
		const eventSpan = document.createElement("span")
		updateEventDisplay(eventSpan, event)
		li.appendChild(eventSpan)

		// Create a delete button
		const deleteBtn = document.createElement("button")
		deleteBtn.textContent = "Delete"
		deleteBtn.addEventListener("click", () => {
			events.splice(index, 1)
			saveEvents()
			renderEvents()
		})
		li.appendChild(deleteBtn)

		eventItemsList.appendChild(li)
	}

	// Render all events in the UI
	function renderEvents() {
		eventItemsList.innerHTML = ""
		events.forEach((event, index) => {
			addEventToList(event, index)
		})
	}

	// Add new event on button click
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
			saveEvents()
			renderEvents()

			// Clear input fields after adding
			eventNameInput.value = ""
			singleDateInput.value = ""
			startDateInput.value = ""
			endDateInput.value = ""
		}
	})

	// Live update the countdown every minute
	setInterval(() => {
		const listItems = document.querySelectorAll("#event-items li")
		listItems.forEach((li) => {
			const index = li.getAttribute("data-index")
			const eventSpan = li.querySelector("span")
			if (events[index] && eventSpan) {
				updateEventDisplay(eventSpan, events[index])
			}
		})
	}, 60000) // updates every 60 seconds

	// Initial render on load
	renderEvents()

	// Placeholder for the Settings button (future implementation)
	document.getElementById("settings-btn").addEventListener("click", () => {
		alert("Settings functionality will be implemented in the future.")
	})
})
