const BASE_URL = "https://api.unsplash.com";
const API_VERSION = "v1";
const DEFAULT_MAX = 100;
const DEFAULT_LIMIT = 100;

const CONTENT_FILTERS = [
  "low",
  "high",
];

const COLOR_OPTIONS = [
  {
    label: "Black and White",
    value: "black_and_white",
  },
  {
    label: "Black",
    value: "black",
  },
  {
    label: "White",
    value: "white",
  },
  {
    label: "Yellow",
    value: "yellow",
  },
  {
    label: "Orange",
    value: "orange",
  },
  {
    label: "Red",
    value: "red",
  },
  {
    label: "Purple",
    value: "purple",
  },
  {
    label: "Magenta",
    value: "magenta",
  },
  {
    label: "Green",
    value: "green",
  },
  {
    label: "Teal",
    value: "teal",
  },
  {
    label: "Blue",
    value: "blue",
  },
];

const ORIENTATION_OPTIONS = [
  {
    label: "Landscape",
    value: "landscape",
  },
  {
    label: "Portrait",
    value: "portrait",
  },
  {
    label: "Squarish",
    value: "squarish",
  },
];

export default {
  BASE_URL,
  API_VERSION,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  CONTENT_FILTERS,
  COLOR_OPTIONS,
  ORIENTATION_OPTIONS,
};
