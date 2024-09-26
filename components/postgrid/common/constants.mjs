const DEFAULT_LIMIT = 20;

const POSTCARD_SIZE = [
  "6x4",
  "9x6",
  "11x6",
];

const MAILING_CLASS = [
  {
    value: "standard_class",
    label: "Standard Class",
  },
  {
    value: "first_class",
    label: "First Class",
  },
];

const ADDRESS_PLACEMENT = [
  {
    value: "top_first_page",
    label: "Top First Page",
  },
  {
    value: "insert_blank_page",
    label: "Insert Blank Page",
  },
];

const EXTRA_SERVICE = [
  {
    value: "certified",
    label: "Certified",
  },
  {
    value: "certified_return_receipt",
    label: "Certified Return Receipt",
  },
  {
    value: "registered",
    label: "Registered",
  },
];

const ENVELOPE_TYPE = [
  {
    value: "standard_double_window",
    label: "Standard Double Window",
  },
  {
    value: "flat",
    label: "Flat",
  },
];

const LETTER_SIZE = [
  {
    value: "us_letter",
    label: "US Letter",
  },
  {
    value: "us_legal",
    label: "US Legal",
  },
  {
    value: "a4",
    label: "A4",
  },
];

export default {
  DEFAULT_LIMIT,
  POSTCARD_SIZE,
  MAILING_CLASS,
  ADDRESS_PLACEMENT,
  EXTRA_SERVICE,
  ENVELOPE_TYPE,
  LETTER_SIZE,
};
