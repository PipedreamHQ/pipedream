const MODEL_OPTIONS = [
  "medium",
  "xlarge",
];

const RETURN_LIKELIHOODS_OPTIONS = [
  "GENERATION",
  "ALL",
  "NONE",
];

const TRUNCATE_OPTIONS = [
  "NONE",
  "START",
  "END",
];

const CLASSIFY_MODEL_OPTIONS = [
  "embed-multilingual-v2.0",
  "embed-english-light-v2.0",
  "embed-english-v2.0",
];

const SUMMARY_LENGTH_OPTIONS = [
  "short",
  "medium",
  "long",
  "auto",
];

const SUMMARY_FORMAT_OPTIONS = [
  "paragraph",
  "bullets",
  "auto",
];

const SUMMARY_MODEL_OPTIONS = [
  "summarize-medium",
  "summarize-xlarge",
];

export default {
  MODEL_OPTIONS,
  RETURN_LIKELIHOODS_OPTIONS,
  TRUNCATE_OPTIONS,
  CLASSIFY_MODEL_OPTIONS,
  SUMMARY_LENGTH_OPTIONS,
  SUMMARY_FORMAT_OPTIONS,
  SUMMARY_MODEL_OPTIONS,
};
