export const constants = {
  CONTAINS: "CONTAINS",
  NOT_CONTAINS: "NOT_CONTAINS",
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
    label: "[Text] Contains",
    value: constants.CONTAINS,
  },
  {
    label: "[Text] Does not contain",
    value: constants.NOT_CONTAINS,
  },
  {
    label: "[Text] Matches exactly",
    value: constants.TEXT_EQUALS,
  },
  {
    label: "[Text] Does not exactly match",
    value: constants.TEXT_NOT_EQUALS,
  },
  {
    label: "[Text] Starts with",
    value: constants.STARTS_WITH,
  },
  {
    label: "[Text] Does not start with",
    value: constants.NOT_STARTS_WITH,
  },
  {
    label: "[Text] Ends with",
    value: constants.ENDS_WITH,
  },
  {
    label: "[Text] Does not end with",
    value: constants.NOT_ENDS_WITH,
  },
];

const numberOptions = [
  {
    label: "[Number] Is greater than",
    value: constants.GREATER_THAN,
  },
  {
    label: "[Number] Is greater than or equal to",
    value: constants.GREATER_THAN_EQUALS,
  },
  {
    label: "[Number] Is less than",
    value: constants.LESS_THAN,
  },
  {
    label: "[Number] Is less than or equal to",
    value: constants.LESS_THAN_EQUALS,
  },
  {
    label: "[Number] Is equal to",
    value: constants.EQUALS,
  },
];

const arrayOptions = [
  {
    label: "[Array] Is present in array",
    value: constants.IN_ARRAY,
  },
  {
    label: "[Array] Is not present in array",
    value: constants.NOT_IN_ARRAY,
  },
];

const objectOptions = [
  {
    label: "[Object] Key exists and is not null or undefined",
    value: constants.KEY_EXISTS,
  },
  {
    label: "[Object] Key does not exist or value is null or undefined",
    value: constants.KEY_NOT_EXISTS,
  },
];

const booleanOptions = [
  {
    label: "[Boolean] Evaluates to True",
    value: constants.TRUE,
  },
  {
    label: "[Boolean] Evaluates to False",
    value: constants.FALSE,
  },
];

const nullOptions = [
  {
    label: "[Null] Is null or undefined",
    value: constants.IS_NULL,
  },
  {
    label: "[Null] Is not null or undefined",
    value: constants.NOT_NULL,
  },
];

const binaryOptions = [
  ...textOptions,
  ...numberOptions,
  ...arrayOptions,
  ...objectOptions,
];

const unaryOptions = [
  ...booleanOptions,
  ...nullOptions,
];

export const textConditions = textOptions.map(({ value }) => value);
export const numberConditions = numberOptions.map(({ value }) => value);
export const arrayConditions = arrayOptions.map(({ value }) => value);
export const objectConditions = objectOptions.map(({ value }) => value);
export const booleanConditions = booleanOptions.map(({ value }) => value);
export const nullConditions = nullOptions.map(({ value }) => value);

export const binaryConditions = binaryOptions.map(({ value }) => value);
export const unaryConditions = unaryOptions.map(({ value }) => value);

export default [
  ...binaryOptions,
  ...unaryOptions,
];
