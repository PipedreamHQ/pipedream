const DEFAULT_LIMIT = 20;

const COLUMN_TYPES = {
  "text": "string",
  "email": "string",
  "url": "string",
  "long-text": "string",
  "number": "integer",
  "percent": "integer",
  "dolar": "integer",
  "euro": "integer",
  "collaborator": "string[]",
  "date": "string",
  "duration": "string",
  "single-select": "string",
  "multiple-select": "string[]",
  "image": "string[]",
  "file": "string[]",
  "checkbox": "boolean",
  "rate": "integer",
  "formula": "string",
  "link": "string[]",
};

export default {
  DEFAULT_LIMIT,
  COLUMN_TYPES,
};
