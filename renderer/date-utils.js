export function daysBetween(a, b) {
  const diff = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)
  return Math.round(diff / 8.64e7)
}

export function inRange(day, start, end = start) {
  return day >= start.setHours(0, 0, 0, 0) && day <= end.setHours(0, 0, 0, 0)
}

export function eventDuration(ev) {
  const s = new Date(ev.start)
  const e = ev.end ? new Date(ev.end) : s
  return daysBetween(s, e) + 1
}

export function isPast(date) {
  return daysBetween(date, new Date()) < 0
}
export function isFuture(date) {
  return daysBetween(new Date(), date) < 0
}
