/**
 * eventList.js
 *
 * @format
 */

import { getDateDifferenceText, saveEvents } from "./events.js"

// Update the display text for a single event
function updateEventDisplay(element, event) {
	let displayText = `${event.name}`
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
export function addEventToList(
	event,
	index,
	events,
	eventItemsList,
	renderEvents
) {
	const li = document.createElement("li")
	li.style.color = event.textColour
	li.style.backgroundColor = event.bgColour
	li.setAttribute("data-index", index)

	// Description span
	const eventSpan = document.createElement("span")
	updateEventDisplay(eventSpan, event)
	li.appendChild(eventSpan)

	// Delete button
	const deleteBtn = document.createElement("button")
	deleteBtn.textContent = "Delete"
	deleteBtn.addEventListener("click", () => {
		events.splice(index, 1)
		saveEvents(events)
		renderEvents()
	})
	li.appendChild(deleteBtn)

	eventItemsList.appendChild(li)
}

// Re-render all events in the UI
export function renderEvents(events, eventItemsList) {
	eventItemsList.innerHTML = ""
	events.forEach((event, index) => {
		addEventToList(event, index, events, eventItemsList, () => {
			renderEvents(events, eventItemsList)
		})
	})
}
