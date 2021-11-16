/**
 * The list of supported field types
 * can be found [here](https://developer.typeform.com/responses/JSON-response-explanation)
 */
const FIELD_TYPES = {
  MATRIX: "matrix",
  RANKING: "ranking",
  DATE: "date",
  DROPDOWN: "dropdown",
  EMAIL: "email",
  FILE_UPLOAD: "file_upload",
  GROUP: "group",
  LEGAL: "legal",
  LONG_TEXT: "long_text",
  MULTIPLE_CHOICE: "multiple_choice",
  NUMBER: "number",
  OPINION_SCALE: "opinion_scale",
  PAYMENT: "payment",
  PICTURE_CHOICE: "picture_choice",
  RATING: "rating",
  SHORT_TEXT: "short_text",
  STATEMENT: "statement",
  WEBSITE: "website",
  YES_NO: "yes_no",
  PHONE_NUMBER: "phone_number",
};

const CONTENT_DISPOSITION_HEADER = "content-disposition";
const CONTENT_DISPOSITION_SEPARATOR = "filename=";
const ALL_FIELD_TYPES =
  Object.keys(FIELD_TYPES)
    .map((key) => FIELD_TYPES[key]);

export default {
  FIELD_TYPES,
  ALL_FIELD_TYPES,
  CONTENT_DISPOSITION_HEADER,
  CONTENT_DISPOSITION_SEPARATOR,
};
