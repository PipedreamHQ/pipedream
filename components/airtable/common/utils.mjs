import {
  FIELD_PREFIX,
  FieldType,

} from "./constants.mjs";

/**
 * Transforms an Airtable field type to a Pipedream prop type
 *
 * @param {string} fieldType - the Airtable field type
 * @returns {string} a Pipedream prop type
 */
function fieldTypeToPropType(fieldType) {
  switch (fieldType) {
  // any
  case FieldType.FORMULA:
  case FieldType.MULTIPLE_LOOKUP_VALUES:
  case FieldType.MULTIPLE_ATTACHMENTS:
  case FieldType.ROLLUP:
    return "any";
  // boolean
  case FieldType.CHECKBOX:
    return "boolean";
  // integer
  case FieldType.COUNT:
  case FieldType.AUTO_NUMBER:
  case FieldType.CURRENCY:
  case FieldType.DURATION:
  case FieldType.NUMBER:
  case FieldType.PERCENT:
  case FieldType.RATING:
    return "integer";
  // object
  case FieldType.BARCODE:
  case FieldType.BUTTON:
  case FieldType.CREATED_BY:
  case FieldType.CREATED_TIME:
  case FieldType.EXTERNAL_SYNC_SOURCE:
  case FieldType.LAST_MODIFIED_BY:
  case FieldType.LAST_MODIFIED_TIME:
  case FieldType.URL:
    return "object";
  // string
  case FieldType.SINGLE_COLLABORATOR:
  case FieldType.DATE:
  case FieldType.DATE_TIME:
  case FieldType.EMAIL:
  case FieldType.MULTILINE_TEXT:
  case FieldType.PHONE_NUMBER:
  case FieldType.RICH_TEXT:
  case FieldType.SINGLE_LINE_TEXT:
  case FieldType.SINGLE_SELECT:
    return "string";
  // string[]
  case FieldType.MULTIPLE_COLLABORATORS:
  case FieldType.MULTIPLE_RECORD_LINKS:
  case FieldType.MULTIPLE_SELECTS:
    return "string[]";
  default:
    return "any";
  }
}

/**
 * Transforms an Airtable field to a Pipedream prop
 *
 * @param {object} field - the Airtable field
 * @returns {object}
 */
function fieldToProp(field) {
  return {
    type: fieldTypeToPropType(field.type),
    label: field.name,
    description: field.description,
    optional: true,
    options: field.options?.choices?.map((choice) => ({
      label: choice.name || choice.id,
      value: choice.id,
    })),
  };
}

/**
 * Creates a set of props corresponding to a table's fields
 *
 * @param {object} tableSchema - The schema of the Airtable table
 * @returns {object} props corresponding to the table's fields
 */
function makeFieldProps(tableSchema) {
  let props = {};
  for (const field of tableSchema?.fields ?? []) {
    props[`${FIELD_PREFIX}${field.name}`] = fieldToProp(field);
  }
  return props;
}

/**
 * Creates a record object from a component's props, intended to be used in a
 * call to the Airtable API
 *
 * @param {object} props - A component's props
 * @returns {object} a record
 */
function makeRecord(props) {
  let record = {};
  for (const key of Object.keys(props)) {
    if (key.startsWith(FIELD_PREFIX)) {
      const fieldName = key.slice(FIELD_PREFIX.length);
      record[fieldName] = props[key];
    }
  }
  return record;
}

export {
  fieldTypeToPropType,
  fieldToProp,
  makeFieldProps,
  makeRecord,
};
