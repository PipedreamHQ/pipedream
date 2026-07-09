const BASE_URL = "https://apis.roblox.com";
const CLOUD_PATH = "/cloud/v2";

// Default and cap for the number of items paginated list actions return.
const DEFAULT_MAX = 100;
// The API caps maxPageSize at 100 for most list endpoints.
const MAX_PAGE_SIZE = 100;

const THUMBNAIL_FORMATS = [
  "PNG",
  "JPEG",
];

const THUMBNAIL_SHAPES = [
  "ROUND",
  "SQUARE",
];

// API defaults for the generate-thumbnail endpoint when the param is omitted.
const THUMBNAIL_DEFAULT_SIZE = 420;
const THUMBNAIL_DEFAULT_FORMAT = "PNG";
const THUMBNAIL_DEFAULT_SHAPE = "ROUND";

// Supported square dimensions for the generated user thumbnail.
const THUMBNAIL_SIZES = [
  48,
  50,
  60,
  75,
  100,
  110,
  150,
  180,
  352,
  420,
  720,
];

const NOTIFICATION_TYPE = "MOMENT";

export default {
  BASE_URL,
  CLOUD_PATH,
  DEFAULT_MAX,
  MAX_PAGE_SIZE,
  THUMBNAIL_FORMATS,
  THUMBNAIL_SHAPES,
  THUMBNAIL_SIZES,
  THUMBNAIL_DEFAULT_SIZE,
  THUMBNAIL_DEFAULT_FORMAT,
  THUMBNAIL_DEFAULT_SHAPE,
  NOTIFICATION_TYPE,
};
