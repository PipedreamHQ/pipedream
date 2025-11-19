import type { PropOptionValue } from "@pipedream/sdk";
import type { RawPropOption } from "../types";

/**
 * Utilities for detecting and handling label-value (__lv) format
 * used by Pipedream components to preserve display labels for option values.
 */

/**
 * Shape returned by remote options when values include their original label.
 * The wrapped payload may itself be a single option or an array of options.
 */
export type LabelValueWrapped<T extends PropOptionValue = PropOptionValue> = Extract<RawPropOption<T>, { __lv: unknown }>;

/**
 * Runtime type guard for the label-value wrapper.
 * @param value - The value to check
 * @returns true if value is an object with a non-null __lv payload
 */
export function isLabelValueWrapped<T extends PropOptionValue = PropOptionValue>(
  value: unknown,
): value is LabelValueWrapped<T> {
  if (!value || typeof value !== "object") return false;
  if (!("__lv" in value)) return false;

  const lvContent = (value as LabelValueWrapped<T>).__lv;
  return lvContent != null;
}

/**
 * Checks if every entry in an array is a label-value wrapper.
 * @param value - The value to check
 * @returns true if all entries are wrapped and contain non-null payloads
 */
export function isArrayOfLabelValueWrapped<T extends PropOptionValue = PropOptionValue>(
  value: unknown,
): value is Array<LabelValueWrapped<T>> {
  if (!Array.isArray(value) || value.length === 0) return false;

  return value.every((item) => isLabelValueWrapped<T>(item));
}

/**
 * Checks if a value has the label-value format (either single or array)
 * @param value - The value to check
 * @returns true if value is in __lv format (single or array)
 */
export function hasLabelValueFormat(value: unknown): boolean {
  return isLabelValueWrapped(value) || isArrayOfLabelValueWrapped(value);
}
