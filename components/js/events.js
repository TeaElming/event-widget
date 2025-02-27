/**
 * events.js
 *
 * @format
 */

// Load and save event data from localStorage
export function loadEvents() {
	return JSON.parse(localStorage.getItem("events")) || []
}

export function saveEvents(events) {
	localStorage.setItem("events", JSON.stringify(events))
}

// Compute day-difference text
export function getDateDifferenceText(targetDate) {
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
