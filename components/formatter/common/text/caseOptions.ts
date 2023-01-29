interface CaseOption {
  label: string;
  value: string;
  outputFn: (s: string) => string;
}

const TITLECASE_MINOR_WORDS = [
  "a",
  "an",
  "and",
  "as",
  "at",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
];

export const CASE_OPTIONS: CaseOption[] = [
  {
    label: "Capitalize the first character of every word in the string",
    value: "Capitalize",
    outputFn(str) {
      return str
        .split(" ")
        .map((word, index) =>
          index && TITLECASE_MINOR_WORDS.includes(word)
            ? word
            : word[0].toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
  {
    label: "Convert all characters in the string to titlecase",
    value: "Titlecase",
    outputFn(str) {
      return str
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
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
