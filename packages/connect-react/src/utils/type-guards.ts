/**
 * Represents an option object with a value and optional label.
 * Used by react-select and similar components.
 */
export interface OptionWithValue {
  /** The actual value of the option (string or number) */
  value: string | number;
  /** Optional display label for the option */
  label?: string;
  /** Internal wrapper object (used by form handling logic) */
  __lv?: unknown;
}

/**
 * Type guard to check if a value is a string.
 * @param value - The value to check
 * @returns true if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Type guard to check if a value is a valid OptionWithValue object.
 * Validates that the object has a 'value' property that is either a string or number.
 * @param value - The value to check
 * @returns true if the value is a valid OptionWithValue
 */
export function isOptionWithValue(value: unknown): value is OptionWithValue {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value &&
    (typeof (value as Record<string, unknown>).value === "string" || typeof (value as Record<string, unknown>).value === "number")
  );
}

/**
 * Type guard to check if a value is an array of strings.
 * @param value - The value to check
 * @returns true if the value is a string array
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/**
 * Type guard to check if a value is an array of OptionWithValue objects.
 * @param value - The value to check
 * @returns true if the value is an array of valid OptionWithValue objects
 */
export function isOptionArray(value: unknown): value is OptionWithValue[] {
  return Array.isArray(value) && value.every((item) => isOptionWithValue(item));
}

/**
 * Normalizes an unknown value into either a string or OptionWithValue.
 * Used for basic option processing where the input format is uncertain.
 * @param option - The option to normalize
 * @returns A normalized string or OptionWithValue object
 */
export function normalizeOption(option: unknown): OptionWithValue | string {
  if (isString(option)) {
    return option;
  }
  if (isOptionWithValue(option)) {
    return option;
  }
  return String(option);
}

/**
 * Normalizes an array of unknown values into an array of strings or OptionWithValue objects.
 * Handles cases where the input might not be an array by returning an empty array.
 * @param options - The options array to normalize
 * @returns An array of normalized options
 */
export function normalizeOptions(options: unknown): Array<OptionWithValue | string> {
  if (!Array.isArray(options)) {
    return [];
  }
  return options.map(normalizeOption);
}

/**
 * Sanitizes an option to ensure it has proper primitive values for label/value.
 * This is the main utility for processing complex nested option structures that can
 * come from various sources (APIs, form data, etc.) into a format compatible with react-select.
 *
 * Handles multiple nesting scenarios:
 * 1. String options: returned as-is (e.g., "simple-option")
 * 2. __lv wrapper objects: extracts inner option from {__lv: {label: "...", value: "..."}}
 * 3. Nested label/value objects: handles {label: {label: "Documents"}, value: {value: "123"}}
 *
 * This function was created to fix React error #31 where nested objects were being
 * passed to React components that expected primitive values.
 *
 * @param option - The option to sanitize (can be string, object, or complex nested structure)
 * @returns A clean option with primitive label/value or a string
 *
 * @example
 * // Simple string
 * sanitizeOption("hello") // returns "hello"
 *
 * @example
 * // Nested object structure
 * sanitizeOption({
 *   label: {label: "Documents", value: "123"},
 *   value: {label: "Documents", value: "123"}
 * }) // returns {label: "Documents", value: "123"}
 *
 * @example
 * // __lv wrapper
 * sanitizeOption({
 *   __lv: {label: "Test", value: "test-id"}
 * }) // returns {label: "Test", value: "test-id"}
 */
export function sanitizeOption(option: unknown): { label: string; value: unknown } | string {
  if (typeof option === "string") return option;

  if (!option || typeof option !== "object") {
    return {
      label: "",
      value: "",
    };
  }

  // If option has __lv wrapper, extract the inner option
  if ("__lv" in option) {
    const innerOption = (option as Record<string, unknown>).__lv;

    let actualLabel = "";
    let actualValue = innerOption?.value;

    // Handle nested label in __lv
    if (innerOption?.label && typeof innerOption.label === "object" && "label" in innerOption.label) {
      actualLabel = String(innerOption.label.label || "");
    } else {
      actualLabel = String(innerOption?.label || innerOption?.value || "");
    }

    // Handle nested value in __lv
    if (innerOption?.value && typeof innerOption.value === "object" && "value" in innerOption.value) {
      actualValue = innerOption.value.value;
    }

    return {
      label: actualLabel,
      value: actualValue,
    };
  }

  // Handle nested label and value objects
  const optionObj = option as Record<string, unknown>;
  let actualLabel = "";
  let actualValue = optionObj.value;

  // Extract nested label
  if (optionObj.label && typeof optionObj.label === "object" && "label" in optionObj.label) {
    actualLabel = String(optionObj.label.label || "");
  } else {
    actualLabel = String(optionObj.label || optionObj.value || "");
  }

  // Extract nested value
  if (optionObj.value && typeof optionObj.value === "object" && "value" in optionObj.value) {
    actualValue = optionObj.value.value;
  }

  return {
    label: actualLabel,
    value: actualValue,
  };
}
