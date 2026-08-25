import { ConfigurationError } from "@pipedream/platform";
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
 * Escapes backslashes and double quotes so a value can be safely interpolated
 * into an Airtable formula string literal
 *
 * @param {*} value - the value to escape
 * @returns {string} the escaped value
 */
function escapeFormulaString(value) {
  return `${value}`.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
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
 * Fetches the field schema of the table selected on a component
 *
 * @param {object} ctx - A component's props
 * @returns {Promise<object[]>} the table's fields
 */
async function getTableFields(ctx) {
  const baseId = ctx.baseId?.value ?? ctx.baseId;
  const tableId = ctx.tableId?.value ?? ctx.tableId;
  const { tables } = await ctx.airtable.listTables({
    baseId,
  });
  const tableSchema = tables.find(({
    id, name,
  }) => id === tableId || name === tableId);
  return tableSchema?.fields ?? [];
}

/**
 * Parses a record that arrived as a JSON string, so that a stringified object
 * is accepted wherever an object is
 *
 * @param {object|string} record - a record keyed by field name
 * @returns {object} the parsed record
 */
function parseRecord(record) {
  if (typeof record !== "string") {
    return record;
  }
  try {
    return JSON.parse(record);
  } catch (err) {
    throw new ConfigurationError(`Error parsing the record as JSON: ${err.message}`);
  }
}

/**
 * Creates a record object from a component's `field_*` props. Retained for
 * workflows configured before these actions exposed a single `record` prop.
 *
 * @param {object} ctx - A component's props
 * @returns {object} a record keyed by field name
 */
function makeRecord(ctx) {
  const record = {};
  for (const key of Object.keys(ctx)) {
    if (key.startsWith(FIELD_PREFIX)) {
      record[key.slice(FIELD_PREFIX.length)] = ctx[key];
    }
  }
  return record;
}

/**
 * Applies the transformations the Airtable API expects for field types that
 * don't accept a bare scalar value
 *
 * @param {object} record - a record keyed by field name
 * @param {object[]} fields - the table's fields
 * @returns {object} the normalized record
 */
function normalizeRecord(record, fields) {
  const fieldTypes = Object.fromEntries(fields.map(({
    name, type,
  }) => [
    name,
    type,
  ]));
  return Object.fromEntries(Object.entries(record).map(([
    key,
    value,
  ]) => [
    key,
    // A collaborator supplied as an object is already in the expected shape
    fieldTypes[key] === FieldType.SINGLE_COLLABORATOR && typeof value === "string"
      ? buildSingleCollaboratorField(value)
      : value,
  ]));
}

/**
 * Throws if a record targets fields that Airtable computes, which the API
 * rejects with an error that isn't actionable on its own
 *
 * @param {object} record - a record keyed by field name
 * @param {object[]} fields - the table's fields
 */
function validateWritableFields(record, fields) {
  const computed = fields
    .filter(isComputedField)
    .map(({ name }) => name)
    .filter((name) => name in record);
  if (computed.length) {
    throw new ConfigurationError(`Airtable computes the following field(s), so they cannot be written to: ${computed.join(", ")}. Remove them from the record and try again.`);
  }
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
  getTableFields,
  makeRecord,
  normalizeRecord,
  parseRecord,
  validateWritableFields,
  withRetry,
};
