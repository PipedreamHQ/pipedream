/**
 * Maps DealCloud field type ID to Pipedream prop type
 * @param {number} fieldTypeId - The DealCloud field type ID
 * @returns {string} The corresponding Pipedream prop type
 */
function mapFieldTypeToPropType(fieldTypeId) {
  switch (fieldTypeId) {
  case 3: // Number
    return "integer";
  case 6: // Boolean
    return "boolean";
  case 1: // Text
  case 2: // Choice
  case 4: // Date
  case 5: // Reference
  case 7: // User
  case 13: // Binary
  case 14: // EntryListId
  case 15: // Counter
  case 16: // Image
  case 17: // DataSource
  case 18: // Currency
  default:
    return "string";
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
    acc[field.apiName] = {
      label: field.name,
      type: mapFieldTypeToPropType(field.fieldType),
      description: `Field ID: \`${field.id}\`. Field type: \`${field.fieldType}\``,
    };
    return acc;
  }, {});
}
