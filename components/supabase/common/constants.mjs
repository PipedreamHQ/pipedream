const FILTER_OPTIONS = [
  {
    label: "Equal",
    value: "equalTo",
  },
  {
    label: "Not Equal",
    value: "notEqualTo",
  },
  {
    label: "Greater Than",
    value: "greaterThan",
  },
  {
    label: "Greater Than or Equal To",
    value: "greaterThanOrEqualTo",
  },
  {
    label: "Less Than",
    value: "lessThan",
  },
  {
    label: "Less Than or Equal To",
    value: "lessThanOrEqualTo",
  },
  {
    label: "Contains (Case Sensitive)",
    value: "patternMatch",
  },
  {
    label: "Contains (Case Insensitive)",
    value: "patternMatchCaseInsensitive",
  },
];

export default {
  FILTER_OPTIONS,
};
