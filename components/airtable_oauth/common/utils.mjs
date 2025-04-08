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
    return "object";
  // string
  case FieldType.URL:
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
    description: field.description ?? `Field type: \`${field.type}\`. Field ID: \`${field.id}\``,
    optional: true,
    options: field.options?.choices?.map((choice) => ({
      label: choice.name || choice.id,
      value: choice.id,
    })),
  };
}

function isComputedField(field) {
  const computedFieldByType = [
    FieldType.FORMULA,
    FieldType.LOOKUP,
    FieldType.COUNT,
    FieldType.ROLLUP,
    FieldType.AUTO_NUMBER,
    FieldType.CREATED_TIME,
    FieldType.CREATED_BY,
    FieldType.LAST_MODIFIED_BY,
    FieldType.LAST_MODIFIED_TIME,
    FieldType.MULTIPLE_LOOKUP_VALUES,
  ].includes(field.type);

  const fieldOptionsResultExists = Boolean(field.options?.result);

  return computedFieldByType || fieldOptionsResultExists;
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
    if (!isComputedField(field)) {
      props[`${FIELD_PREFIX}${field.name}`] = fieldToProp(field);
    }
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
async function makeRecord(ctx) {
  let record = {};
  const fieldTypes = await mapFieldTypes(ctx);
  for (const key of Object.keys(ctx)) {
    if (key.startsWith(FIELD_PREFIX)) {
      const fieldName = key.slice(FIELD_PREFIX.length);
      if (fieldTypes[fieldName] === FieldType.SINGLE_COLLABORATOR) {
        record[fieldName] = buildSingleCollaboratorField(ctx[key]);
        continue;
      }
      record[fieldName] = ctx[key];
    }
  }
  return record;
}

async function mapFieldTypes(ctx) {
  const baseId = ctx.baseId?.value ?? ctx.baseId;
  const tableId = ctx.tableId?.value ?? ctx.tableId;
  const { tables } = await ctx.airtable.listTables({
    baseId,
  });
  const tableSchema = tables.find(({ id }) => id === tableId);
  const fieldTypes = {};
  for (const field of tableSchema?.fields ?? []) {
    fieldTypes[field.name] = field.type;
  }
  return fieldTypes;
}

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

function buildSingleCollaboratorField(value) {
  return isEmail(value)
    ? {
      email: value,
    }
    : {
      id: value,
    };
}

export {
  fieldTypeToPropType,
  fieldToProp,
  makeFieldProps,
  makeRecord,
};
