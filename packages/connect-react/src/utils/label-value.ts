/**
 * Utilities for detecting and handling label-value (__lv) format
 * used by Pipedream components to preserve display labels for option values
 */

/**
 * Checks if a value is wrapped in the __lv format
 * @param value - The value to check
 * @returns true if value is an object with __lv property containing valid data
 *
 * @example
 * isLabelValueWrapped({ __lv: { label: "Option 1", value: 123 } }) // true
 * isLabelValueWrapped({ __lv: null }) // false
 * isLabelValueWrapped({ value: 123 }) // false
 */
export function isLabelValueWrapped(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (!("__lv" in value)) return false;

  const lvContent = (value as Record<string, unknown>).__lv;
  return lvContent != null;
}

/**
 * Checks if a value is an array of __lv wrapped objects
 * @param value - The value to check
 * @returns true if value is an array of valid __lv wrapped objects
 *
 * @example
 * isArrayOfLabelValueWrapped([{ __lv: { label: "A", value: 1 } }]) // true
 * isArrayOfLabelValueWrapped([]) // false
 * isArrayOfLabelValueWrapped([{ value: 1 }]) // false
 */
export function isArrayOfLabelValueWrapped(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  if (value.length === 0) return false;

  return value.every((item) =>
    item &&
    typeof item === "object" &&
    "__lv" in item &&
    (item as Record<string, unknown>).__lv != null);
}

/**
 * Checks if a value has the label-value format (either single or array)
 * @param value - The value to check
 * @returns true if value is in __lv format (single or array)
 *
 * @example
 * hasLabelValueFormat({ __lv: { label: "A", value: 1 } }) // true
 * hasLabelValueFormat([{ __lv: { label: "A", value: 1 } }]) // true
 * hasLabelValueFormat({ value: 1 }) // false
 */
export function hasLabelValueFormat(value: unknown): boolean {
  return isLabelValueWrapped(value) || isArrayOfLabelValueWrapped(value);
}
