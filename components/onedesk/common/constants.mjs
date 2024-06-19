const PRIORITY_OPTIONS = [
  {
    label: "0 Stars",
    value: 0,
  },
  {
    label: "1 Star",
    value: 20,
  },
  {
    label: "2 Stars",
    value: 40,
  },
  {
    label: "3 Stars",
    value: 60,
  },
  {
    label: "4 Stars",
    value: 80,
  },
  {
    label: "5 Stars",
    value: 100,
  },
];

const DEFAULT_LIMIT = 20;
const DEFAULT_MAX = 100;

const DATE_OPERATOR = {
  LE: {
    label: "Less Than or Equal",
    value: "LE",
  },
  LT: {
    label: "Less Than",
    value: "LT",
  },
  GT: {
    label: "Greater Than",
    value: "GT",
  },
  GE: {
    label: "Greater Than or Equal",
    value: "GE",
  },
};

const LAST_CREATION_DATE = "lastCreationDate";

export default {
  PRIORITY_OPTIONS,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  DATE_OPERATOR,
  LAST_CREATION_DATE,
};
