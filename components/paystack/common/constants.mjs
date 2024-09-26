const DEFAULT_LIMIT = 50;

const CURRENCIES = [
  {
    label: "Nigerian Naira",
    value: "NGN",
  },
  {
    label: "United States Dollar",
    value: "USD",
  },
  {
    label: "Ghanaian Cedi",
    value: "GHS",
  },
  {
    label: "South African Rand",
    value: "ZAR",
  },
  {
    label: "Kenyan Shilling",
    value: "KES",
  },
];

const STATUS = [
  "failed",
  "success",
  "abandoned",
];

export default {
  DEFAULT_LIMIT,
  CURRENCIES,
  STATUS,
};
