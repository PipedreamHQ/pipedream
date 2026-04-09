/**
 * Logical name for Category of Appointment (Appointment tab).
 * Override per deployment with env `APPOINTMENT_CATEGORY_FIELD` (falls back to `new_type`).
 * In Pipedream: set the variable on the workflow or in project/environment settings if supported.
 * @see https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/reference/appointment
 */
function resolveAppointmentCategoryField() {
  const raw =
    typeof process !== "undefined" && process.env?.APPOINTMENT_CATEGORY_FIELD;
  const trimmed = raw
    ? String(raw).trim()
    : "";
  return trimmed || "new_type";
}

export const APPOINTMENT_CATEGORY_OF_APPOINTMENT_FIELD =
  resolveAppointmentCategoryField();

/**
 * @param {string} entityIdHeader OData-EntityId response header
 * @returns {string} Appointment id or empty string
 */
export function appointmentIdFromEntityHeader(entityIdHeader) {
  if (!entityIdHeader) {
    return "";
  }
  const match = String(entityIdHeader).match(/appointments\(([^)]+)\)/);
  return match
    ? match[1]
    : "";
}

/**
 * @param {string} value
 * @param {string} fieldLabel
 * @returns {number} Epoch milliseconds
 */
export function parseScheduleMs(value, fieldLabel) {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) {
    throw new Error(`${fieldLabel} must be a valid ISO 8601 datetime`);
  }
  return ms;
}
