const CHAT_RESPONSE_FORMAT = {
  TEXT: {
    label: "Text",
    value: "text",
  },
  JSON_OBJECT: {
    label: "JSON Object",
    value: "json_object",
  },
  JSON_SCHEMA: {
    label: "JSON Schema",
    value: "json_schema",
  },
};

const SUMMARIZE_LENGTH = [
  "word",
  "sentence",
  "paragraph",
  "page",
];

export default {
  CHAT_RESPONSE_FORMAT,
  SUMMARIZE_LENGTH,
};

