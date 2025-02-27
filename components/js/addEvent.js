/** @format */

import { saveEvents } from "./events.js"
import { renderEvents } from "./eventsList.js"

export function setupAddEvent(events, eventItemsList, onEventAdded) {
	const eventNameInput = document.getElementById("event-name")
	const singleDateInput = document.getElementById("single-date")
	const startDateInput = document.getElementById("start-date")
	const endDateInput = document.getElementById("end-date")
	const textColourInput = document.getElementById("text-colour")
	const bgColourInput = document.getElementById("bg-colour")
	const addEventButton = document.getElementById("add-event")

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
			saveEvents(events)
			renderEvents(events, eventItemsList)

			// Clear input fields
			eventNameInput.value = ""
			singleDateInput.value = ""
			startDateInput.value = ""
			endDateInput.value = ""

			// Close the modal
			if (onEventAdded) onEventAdded()
		}
	})
}
