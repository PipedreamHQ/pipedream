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
  EXISTS: "EXISTS",
  NOT_EXISTS: "NOT_EXISTS",
};

const options = [
  {
    label: "Contains (text)",
    value: constants.IN,
  },
  {
    label: "Does not contain (text)",
    value: constants.NOT_IN,
  },
  {
    label: "Matches exactly (text)",
    value: constants.TEXT_EQUALS,
  },
  {
    label: "Does not exactly match (text)",
    value: constants.TEXT_NOT_EQUALS,
  },
  {
    label: "Starts with (text)",
    value: constants.STARTS_WITH,
  },
  {
    label: "Does not start with (text)",
    value: constants.NOT_STARTS_WITH,
  },
  {
    label: "Ends with (text)",
    value: constants.ENDS_WITH,
  },
  {
    label: "Does not end with (text)",
    value: constants.NOT_ENDS_WITH,
  },
  {
    label: "Greater than (number)",
    value: constants.GREATER_THAN,
  },
  {
    label: "Greater than or equals (number)",
    value: constants.GREATER_THAN_EQUALS,
  },
  {
    label: "Less than (number)",
    value: constants.LESS_THAN,
  },
  {
    label: "Less than or equals (number)",
    value: constants.LESS_THAN_EQUALS,
  },
  {
    label: "Is equal to (number)",
    value: constants.EQUALS,
  },
  {
    label: "After (date/time)",
    value: constants.AFTER,
  },
  {
    label: "Before (date/time)",
    value: constants.BEFORE,
  },
  {
    label: "Equals (date/time)",
    value: constants.DATE_EQUALS,
  },
  {
    label: "Is True (boolean)",
    value: constants.TRUE,
  },
  {
    label: "Is False (boolean)",
    value: constants.FALSE,
  },
  {
    label: "Exists (object key)",
    value: constants.EXISTS,
  },
  {
    label: "Does not exist (object key)",
    value: constants.NOT_EXISTS,
  },
];

export default {
  constants,
  options,
};
