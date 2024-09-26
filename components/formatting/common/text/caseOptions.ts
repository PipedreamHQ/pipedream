import pluralize from "pluralize";
import { titleCase } from "title-case";

interface CaseOption {
  label: string;
  value: string;
  outputFn: (s: string) => string;
}

export const CASE_OPTIONS: CaseOption[] = [
  {
    label: "Capitalize the first character of every word in the string",
    value: "Capitalize",
    outputFn(str) {
      return str
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    label: "Convert all characters in the string to titlecase",
    value: "Titlecase",
    outputFn(str) {
      return titleCase(str);
    },
  },
  {
    label:
      "Pluralize any English word (frog turns into frogs; child turns into children)",
    value: "Pluralize",
    outputFn(str) {
      return pluralize.plural(str);
    },
  },
  {
    label: "Capitalize every character in the string",
    value: "Uppercase",
    outputFn(str) {
      return str.toUpperCase();
    },
  },
  {
    label: "Convert all characters in the string to lowercase",
    value: "Lowercase",
    outputFn(str) {
      return str.toLowerCase();
    },
  },
];

export const CASE_OPTIONS_PROP = CASE_OPTIONS.map(({
  label, value,
}) => ({
  label,
  value,
}));
