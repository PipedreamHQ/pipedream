const types = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  DATETIME: "DATETIME",
  BOOLEAN: "BOOLEAN",
  NULL: "NULL",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
};

const constants = {
  IN: "IN",
  NOT_IN: "NOT_IN",
  TEXT_EQUALS: "TEXT_EQUALS",
  TEXT_NOT_EQUALS: "TEXT_NOT_EQUALS",
  STARTS_WITH: "STARTS_WITH",
  NOT_STARTS_WITH: "NOT_STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  NOT_ENDS_WITH: "NOT_ENDS_WITH",
  GREATER_THAN: "GREATER_THAN",
  GREATER_THAN_EQUALS: "GREATER_THAN_EQUALS",
  LESS_THAN: "LESS_THAN",
  LESS_THAN_EQUALS: "LESS_THAN_EQUALS",
  EQUALS: "EQUALS",
  AFTER: "AFTER",
  BEFORE: "BEFORE",
  DATE_EQUALS: "DATE_EQUALS",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IS_NULL: "IS_NULL",
  NOT_NULL: "NOT_NULL",
  IN_ARRAY: "IN_ARRAY",
  NOT_IN_ARRAY: "NOT_IN_ARRAY",
  KEY_EXISTS: "KEY_EXISTS",
  KEY_NOT_EXISTS: "KEY_NOT_EXISTS",
};

const textOptions = [
  {
    label: "Contains",
    value: constants.IN,
  },
  {
    label: "Does not contain",
    value: constants.NOT_IN,
  },
  {
    label: "Matches exactly",
    value: constants.TEXT_EQUALS,
  },
  {
    label: "Does not exactly match",
    value: constants.TEXT_NOT_EQUALS,
  },
  {
    label: "Starts with",
    value: constants.STARTS_WITH,
  },
  {
    label: "Does not start with",
    value: constants.NOT_STARTS_WITH,
  },
  {
    label: "Ends with",
    value: constants.ENDS_WITH,
  },
  {
    label: "Does not end with",
    value: constants.NOT_ENDS_WITH,
  },
];

const numberOptions = [
  {
    label: "Greater than",
    value: constants.GREATER_THAN,
  },
  {
    label: "Greater than or equals",
    value: constants.GREATER_THAN_EQUALS,
  },
  {
    label: "Less than",
    value: constants.LESS_THAN,
  },
  {
    label: "Less than or equals",
    value: constants.LESS_THAN_EQUALS,
  },
  {
    label: "Is equal to",
    value: constants.EQUALS,
  },
];

const dateTimeOptions = [
  {
    label: "After",
    value: constants.AFTER,
  },
  {
    label: "Before",
    value: constants.BEFORE,
  },
  {
    label: "Equals",
    value: constants.DATE_EQUALS,
  },
];

const booleanOptions = [
  {
    label: "Is True",
    value: constants.TRUE,
  },
  {
    label: "Is False",
    value: constants.FALSE,
  },
];

const nullOptions = [
  {
    label: "Is null or undefined",
    value: constants.IS_NULL,
  },
  {
    label: "Is not null or undefined",
    value: constants.NOT_NULL,
  },
];

const arrayOptions = [
  {
    label: "Is in array",
    value: constants.IN_ARRAY,
  },
  {
    label: "Is not in array",
    value: constants.NOT_IN_ARRAY,
  },
];

const objectOptions = [
  {
    label: "Key exists and value is not null or undefined",
    value: constants.KEY_EXISTS,
  },
  {
    label: "Key does not exist or value is null or undefined",
    value: constants.KEY_NOT_EXISTS,
  },
];

export default {
  types,
  constants,
  textOptions,
  numberOptions,
  dateTimeOptions,
  booleanOptions,
  nullOptions,
  arrayOptions,
  objectOptions,
};
