const FILTER_OPTIONS = [
  {
    label: "Equal",
    value: 1,
  },
  {
    label: "Not Equal",
    value: 2,
  },
  {
    label: "Greater Than",
    value: 3,
  },
  {
    label: "Greater Than or Equal To",
    value: 4,
  },
  {
    label: "Less Than",
    value: 5,
  },
  {
    label: "Less Than or Equal To",
    value: 6,
  },
  {
    label: "Contains (Case Sensitive)",
    value: 7,
  },
  {
    label: "Contains (Case Insensitive)",
    value: 8,
  },
];

const FILTER_METHODS = {
  1: "equalTo",
  2: "notEqualTo",
  3: "greaterThan",
  4: "greaterThanOrEqualTo",
  5: "lessThan",
  6: "lessThanOrEqualTo",
  7: "patternMatch",
  8: "patternMatchCaseInsensitive",
};

export default {
  FILTER_OPTIONS,
  FILTER_METHODS,
};
