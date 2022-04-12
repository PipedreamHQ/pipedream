import { FIELD_PREFIX } from "./constants.mjs";

import { FieldType } from "@airtable/blocks/models.js";

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

function fieldToProp(field) {
  return {
    type: fieldTypeToPropType(field.type),
    label: field.name,
    description: field.description ?? "",
    optional: true,
    options: field.options?.choices.map((choice) => ({
      label: choice.name,
      value: choice.id,
    })),
  };
}

function makeFieldProps(tableSchema) {
  let props = {};
  let table;
  try {
    table = JSON.parse(tableSchema);
  } catch (err) {
    throw new Error(`Error parsing table schema ${tableSchema}`);
  }
  for (const field of table.fields) {
    props[`${FIELD_PREFIX}${field.id}`] = fieldToProp(field);
  }
  return props;
}

function makeRecord(props) {
  let record = {};
  for (const key of props) {
    if (key.startsWith(FIELD_PREFIX)) {
      const fieldName = key.slice(FIELD_PREFIX.length);
      record[fieldName] = props[key];
    }
  }
}

export {
  fieldTypeToPropType,
  fieldToProp,
  makeFieldProps,
  makeRecord,
};
