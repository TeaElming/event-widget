/* Datastore: all events kept in localStorage under key "events" */
const KEY = 'events'

export function loadEvents() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

export function saveEvents(events) {
  localStorage.setItem(KEY, JSON.stringify(events))
}

export function upsertEvent(event) {
  const arr = loadEvents().filter((e) => e.id !== event.id)
  arr.push(event)
  saveEvents(arr)
}

export function deleteEvent(id) {
  saveEvents(loadEvents().filter((e) => e.id !== id))
}

export function generateId() {
  return crypto.randomUUID()
}
