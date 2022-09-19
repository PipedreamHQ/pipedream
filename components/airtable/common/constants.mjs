/**
 * Prefix used to distinguish "field" props from other props
 */
const FIELD_PREFIX = "field_";

/**
 * An enum of Airtable's field types
 *
 * @see
 * {@link https://www.airtable.com/developers/apps/api/FieldType Airtable FieldType Reference}
 */
const FieldType = {
  FORMULA: "formula",
  MULTIPLE_LOOKUP_VALUES: "multipleLookupValues",
  MULTIPLE_ATTACHMENTS: "multipleAttachments",
  ROLLUP: "rollup",
  // boolean
  CHECKBOX: "checkbox",
  // integer
  COUNT: "count",
  AUTO_NUMBER: "autoNumber",
  CURRENCY: "currency",
  DURATION: "duration",
  NUMBER: "number",
  PERCENT: "percent",
  RATING: "rating",
  // object
  BARCODE: "barcode",
  BUTTON: "button",
  CREATED_BY: "createdBy",
  CREATED_TIME: "createdTime",
  EXTERNAL_SYNC_SOURCE: "externalSyncSource",
  LAST_MODIFIED_BY: "lastModifiedBy",
  LAST_MODIFIED_TIME: "lastModifiedTime",
  URL: "url",
  // string
  SINGLE_COLLABORATOR: "singleCollaborator",
  DATE: "date",
  DATE_TIME: "dateTime",
  EMAIL: "email",
  MULTILINE_TEXT: "multilineText",
  PHONE_NUMBER: "phoneNumber",
  RICH_TEXT: "richText",
  SINGLE_LINE_TEXT: "singleLineText",
  SINGLE_SELECT: "singleSelect",
  // string[]
  MULTIPLE_COLLABORATORS: "multipleCollaborators",
  MULTIPLE_RECORD_LINKS: "multipleRecordLinks",
  MULTIPLE_SELECTS: "multipleSelects",
};

export {
  FIELD_PREFIX,
  FieldType,
};
