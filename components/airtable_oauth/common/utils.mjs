import { ConfigurationError } from "@pipedream/platform";
import isEmpty from "lodash.isempty";
import {
  FALSY_SEARCH_VALUES,
  FIELD_PREFIX,
  FieldType,
  TRUTHY_SEARCH_VALUES,
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
 * Parses the `record` prop, which may arrive as an object or as a JSON string
 * when set via a custom expression
 *
 * @param {object|string} record - the value of the `record` prop
 * @returns {object} field name/value pairs
 */
function parseRecordInput(record) {
  if (!record) {
    return {};
  }
  if (typeof record === "string") {
    try {
      return JSON.parse(record);
    } catch (err) {
      throw new ConfigurationError(`Error parsing Record as JSON: ${err.message}`);
    }
  }
  return record;
}

/**
 * Creates a record object from a component's props, intended to be used in a
 * call to the Airtable API. Values from the `record` prop take precedence over
 * the per-field props generated from the table schema.
 *
 * @param {object} ctx - A component's props
 * @returns {object} a record
 */
async function makeRecord(ctx) {
  const recordInput = parseRecordInput(ctx.record);
  const fieldKeys = Object.keys(ctx).filter((key) => key.startsWith(FIELD_PREFIX));

  if (!fieldKeys.length && isEmpty(recordInput)) {
    return {};
  }

  const record = {};
  for (const key of fieldKeys) {
    if (ctx[key] !== undefined) {
      record[key.slice(FIELD_PREFIX.length)] = ctx[key];
    }
  }
  Object.assign(record, recordInput);

  const fieldTypes = await mapFieldTypes(ctx);
  for (const [
    fieldName,
    value,
  ] of Object.entries(record)) {
    if (fieldTypes[fieldName] === FieldType.SINGLE_COLLABORATOR && typeof value === "string") {
      record[fieldName] = buildSingleCollaboratorField(value);
    }
  }
  return record;
}

/**
 * Maps the selected table's field names to their Airtable field types. Resolves
 * to an empty map when the schema can't be fetched — e.g. a table ID supplied
 * as a custom expression — so the API surfaces the real error instead.
 *
 * @param {object} ctx - A component's props
 * @returns {object} field name to field type
 */
async function mapFieldTypes(ctx) {
  const baseId = ctx.baseId?.value ?? ctx.baseId;
  const tableId = ctx.tableId?.value ?? ctx.tableId;
  const fieldTypes = {};
  try {
    const { tables } = await ctx.airtable.listTables({
      baseId,
    });
    const tableSchema = tables.find(({ id }) => id === tableId);
    for (const field of tableSchema?.fields ?? []) {
      fieldTypes[field.name] = field.type;
    }
  } catch (err) {
    return fieldTypes;
  }
  return fieldTypes;
}

/**
 * Escapes a value for use inside a double-quoted Airtable formula string
 * literal, so values containing quotes don't produce an invalid formula
 *
 * @param {*} value - the value to interpolate
 * @returns {string} the escaped value
 */
function escapeFormulaString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "\\\"");
}

/**
 * Coerces a search value into a boolean. Values reaching a component prop are
 * strings, so truthiness alone would treat `"false"` as `true`
 *
 * @param {*} value - the value to coerce
 * @returns {boolean}
 */
function parseBooleanValue(value) {
  if (typeof value === "boolean") {
    return value;
  }
  const normalized = String(value).trim()
    .toLowerCase();
  if (TRUTHY_SEARCH_VALUES.includes(normalized)) {
    return true;
  }
  if (FALSY_SEARCH_VALUES.includes(normalized)) {
    return false;
  }
  throw new ConfigurationError(`Could not interpret "${value}" as a checkbox value. Use one of \`${[
    ...TRUTHY_SEARCH_VALUES,
    ...FALSY_SEARCH_VALUES,
  ].join("`, `")}\`.`);
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry(fn, {
  retries = 2, baseDelay = 500,
} = {}) {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(baseDelay * (2 ** attempt));
      attempt += 1;
    }
  }
}

export {
  escapeFormulaString,
  fieldTypeToPropType,
  fieldToProp,
  makeFieldProps,
  makeRecord,
  parseBooleanValue,
  withRetry,
};
