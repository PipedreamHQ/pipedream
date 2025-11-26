import { ConfigurationError } from "@pipedream/platform";
import { CURRENCY_OPTIONS } from "./constants.mjs";

export function checkIdArray(value) {
  if (typeof value === "string") {
    return value.split(",").map((id) => id.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value;
  }
  throw new ConfigurationError("Invalid ID array input: " + JSON.stringify(value));
}

const FIELD_TYPES = {
  TEXT: 1,
  CHOICE: 2,
  NUMBER: 3,
  DATE: 4,
  REFERENCE: 5,
  BOOLEAN: 6,
  USER: 7,
  BINARY: 13,
  ENTRY_LIST_ID: 14,
  COUNTER: 15,
  IMAGE: 16,
  DATA_SOURCE: 17,
  CURRENCY: 18,
};

/**
 * Maps DealCloud field type ID to Pipedream prop type
 * @param {number} fieldTypeId - The DealCloud field type ID
 * @param {boolean} isArray - Whether the field is an array
 * @returns {string} The corresponding Pipedream prop type
 */
function mapFieldTypeToPropType(fieldTypeId, isArray) {
  switch (fieldTypeId) {
  case FIELD_TYPES.NUMBER:
    return isArray
      ? "integer[]"
      : "integer";
  case FIELD_TYPES.BOOLEAN:
    return "boolean";
  default:
    return isArray
      ? "string[]"
      : "string";
  }
}

/**
 * @typedef {Object} DealCloudField
 * @property {string} apiName - The API name of the field
 * @property {number} fieldType - The type of the field (numeric code)
 * @property {boolean} isRequired - Whether the field is required
 * @property {boolean} isMoney - Whether the field represents a monetary value
 * @property {boolean} isMultiSelect - Whether the field allows multiple selections
 * @property {Array} entryLists - List of entry options for the field
 * @property {number} systemFieldType - The system field type (numeric code)
 * @property {boolean} isKey - Whether the field is a key field
 * @property {boolean} isCalculated - Whether the field is calculated
 * @property {number} id - The unique identifier of the field
 * @property {string} name - The display name of the field
 * @property {number} entryListId - The ID of the associated entry list
 */

/**
 * Converts DealCloud fields to Pipedream prop format
 * @param {DealCloudField[]} fields - Array of DealCloud field objects
 * @returns Object to be returned in dynamic props
 */
export function convertFieldsToProps(fields) {
  return fields.reduce((acc, field) => {
    const { fieldType } = field;
    const prop = {
      label: field.name,
      type: mapFieldTypeToPropType(fieldType, field.isMultiSelect),
      description: `Field ID: \`${field.id}\`. Field type: \`${field.fieldType}\``,
      optional: this.isUpdate()
        ? true
        : !field.isRequired,
    };

    if (fieldType === FIELD_TYPES.CURRENCY) {
      prop.options = CURRENCY_OPTIONS;
    }

    if (field.entryLists?.length) {
      // TODO: add dynamic options for entry lists
      prop.description = prop.description + ` Entry List ID: \`${field.entryLists[0]}\``;
    }

    acc[`field_${field.id}`] = prop;
    return acc;
  }, {});
}
