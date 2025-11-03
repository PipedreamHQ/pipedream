import {
  LabelValueOption,
  RawPropOption,
} from "../types";
import type {
  ConfigurableProp,
  ConfigurablePropAirtableBaseId,
  ConfigurablePropAirtableFieldId,
  ConfigurablePropAirtableTableId,
  ConfigurablePropAirtableViewId,
  ConfigurablePropAlert,
  ConfigurablePropAny,
  ConfigurablePropApp,
  ConfigurablePropApphook,
  ConfigurablePropBoolean,
  ConfigurablePropDb,
  ConfigurablePropDiscordChannel,
  ConfigurablePropDiscordChannelArray,
  ConfigurablePropHttp,
  ConfigurablePropInteger,
  ConfigurablePropIntegerArray,
  ConfigurablePropObject,
  ConfigurablePropSql,
  ConfigurablePropString,
  ConfigurablePropStringArray,
  ConfigurablePropTimer,
  PropOptionNested, PropOptionValue,
} from "@pipedream/sdk";

/**
 * Type guard to check if a value is a string.
 * @param value - The value to check
 * @returns true if the value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Mapping of configurable prop types to their corresponding TypeScript types.
 * This map is used to determine the specific type of a ConfigurableProp based
 * on its 'type' discriminator.
 */
type DiscriminatorPropTypeMap = {
  "$.airtable.baseId": ConfigurablePropAirtableBaseId;
  "$.airtable.fieldId": ConfigurablePropAirtableFieldId;
  "$.airtable.tableId": ConfigurablePropAirtableTableId;
  "$.airtable.viewId": ConfigurablePropAirtableViewId;
  "$.discord.channel": ConfigurablePropDiscordChannel;
  "$.discord.channel[]": ConfigurablePropDiscordChannelArray;
  "$.interface.apphook": ConfigurablePropApphook;
  "$.interface.http": ConfigurablePropHttp;
  "$.interface.timer": ConfigurablePropTimer;
  "$.service.db": ConfigurablePropDb;
  "integer[]": ConfigurablePropIntegerArray;
  "string[]": ConfigurablePropStringArray;
  alert: ConfigurablePropAlert;
  any: ConfigurablePropAny;
  app: ConfigurablePropApp;
  boolean: ConfigurablePropBoolean;
  integer: ConfigurablePropInteger;
  object: ConfigurablePropObject;
  sql: ConfigurablePropSql;
  string: ConfigurablePropString;
}

/**
 * Type guard to check if a ConfigurableProp is of a specific type.
 * @param prop - The ConfigurableProp to check
 * @param type - The type to check against
 * @returns true if the prop is of the specified type
 */
export function isConfigurablePropOfType<K extends keyof DiscriminatorPropTypeMap>(
  prop: ConfigurableProp,
  type: K,
): prop is DiscriminatorPropTypeMap[K] {
  return prop.type === type;
}

/**
 * Type guard to check if a value has a label and value structure. Validates
 * that the value is a non-null object (not an array) with a 'value' property
 * that is either a string or number.
 *
 * @param value - The value to check
 * @returns true if the value has a valid label/value structure
 */
export function isOptionWithLabel(value: unknown): value is LabelValueOption {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&

    // XXX: We should validate the label as well
    "value" in value &&
    (typeof (value as Record<string, unknown>).value === "string" || typeof (value as Record<string, unknown>).value === "number")
  );
}

/**
 * Sanitizes an option to ensure it returns a standardized LabelValueOption
 * format. Processes various input formats into a consistent {label: string,
 * value: T} structure.
 *
 * Handles multiple input scenarios:
 * 1. Null/undefined: returns empty label and value
 * 2. Non-objects (primitives): converts to {label: stringified value, value:
 *    original value}
 * 3. __lv wrapper objects: recursively extracts and sanitizes the inner option
 * 4. Objects with 'value' property: returns {label: label || value
 *    (stringified), value: value}
 * 5. Other objects: returns {label: stringified object, value: object}
 *
 * @param option - The option to sanitize (can be null, primitive, object, or
 * __lv wrapped)
 * @returns A standardized LabelValueOption with label (string) and value (T)
 *
 * @example
 * // Primitive value
 * sanitizeOption("hello") // returns {label: "hello", value: "hello"}
 *
 * @example
 * // Object with value property
 * sanitizeOption({
 *   label: "Documents",
 *   value: "123"
 * }) // returns {label: "Documents", value: "123"}
 *
 * @example
 * // __lv wrapper
 * sanitizeOption({
 *   __lv: {label: "Test", value: "test-id"}
 * }) // returns {label: "Test", value: "test-id"}
 */
export function sanitizeOption<T extends PropOptionValue>(option: RawPropOption<T>): LabelValueOption<T> {
  if (option === null || option === undefined) {
    return {
      label: "",
      // Preserve previous runtime: include a value
      value: "" as T,
    };
  }

  if (typeof option !== "object") {
    return {
      label: String(option),
      value: option,
    };
  }

  // If option has __lv wrapper, extract the inner option
  if ("__lv" in option) {
    return sanitizeOption(option.__lv as LabelValueOption<T>);
  }
  // If option has SDK 'lv' wrapper, extract inner option
  if ("lv" in option) {
    return sanitizeOption((option as PropOptionNested).lv as LabelValueOption<T>);
  }

  if ("value" in option) {
    const {
      label,
      value,
    } = option;
    return {
      label: String(label || value),
      value: value,
    };
  }

  return {
    label: String(option),
    value: option as unknown as T,
  };
}
