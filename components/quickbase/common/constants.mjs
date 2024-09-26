const DEFAULT_LIMIT = 50;

const FIELD_TYPES = {
  "text": "string",
  "rich-text": "string",
  "text-multi-line": "string",
  "text-multiple-choice": "string",
  "multitext": "string[]",
  "address": "string",
  "email": "string",
  "url": "string",
  "numeric": "string",
  "percent": "string",
  "rating": "string",
  "currency": "string",
  "duration": "string",
  "date": "string",
  "datetime": "string",
  "timeofday": "string",
  "checkbox": "boolean",
  "phone": "string",
  "user": "string",
  "multiuser": "string",
  "file": "string",
};

const NUMERIC_FIELD_TYPES = [
  "numeric",
  "percent",
  "rating",
  "currency",
  "duration",
];

const OBJECT_FIELD_TYPES = [
  "user",
  "multiuser",
  "file",
];

export default {
  DEFAULT_LIMIT,
  FIELD_TYPES,
  NUMERIC_FIELD_TYPES,
  OBJECT_FIELD_TYPES,
};
