const HARM_CATEGORIES = [
  {
    value: "HARM_CATEGORY_UNSPECIFIED",
    label: "Category is unspecified",
    numValue: 0,
  },
  {
    value: "HARM_CATEGORY_DEROGATORY",
    label: "Negative or harmful comments targeting identity and/or protected attribute",
    numValue: 1,
  },
  {
    value: "HARM_CATEGORY_TOXICITY",
    label: "Content that is rude, disrepspectful, or profane",
    numValue: 2,
  },
  {
    value: "HARM_CATEGORY_VIOLENCE",
    label: "Describes scenarios depictng violence against an individual or group, or general descriptions of gore",
    numValue: 3,
  },
  {
    value: "HARM_CATEGORY_SEXUAL",
    label: "Contains references to sexual acts or other lewd content",
    numValue: 4,
  },
  {
    value: "HARM_CATEGORY_MEDICAL",
    label: "Promotes unchecked medical advice",
    numValue: 5,
  },
  {
    value: "HARM_CATEGORY_DANGEROUS",
    label: "Dangerous content that promotes, facilitates, or encourages harmful acts",
    numValue: 6,
  },
];

const HARM_BLOCK_THRESHOLD = [
  {
    value: "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
    label: "Threshold is unspecified",
    numValue: 0,
  },
  {
    value: "BLOCK_LOW_AND_ABOVE",
    label: "Content with NEGLIGIBLE will be allowed",
    numValue: 1,
  },
  {
    value: "BLOCK_MEDIUM_AND_ABOVE",
    label: "Content with NEGLIGIBLE and LOW will be allowed",
    numValue: 2,
  },
  {
    value: "BLOCK_ONLY_HIGH",
    label: "Content with NEGLIGIBLE, LOW, and MEDIUM will be allowed",
    numValue: 3,
  },
  {
    value: "BLOCK_NONE",
    label: "All content will be allowed",
    numValue: 4,
  },
];

export default {
  HARM_CATEGORIES,
  HARM_BLOCK_THRESHOLD,
};
