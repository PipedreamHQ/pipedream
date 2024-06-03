const BASE_URL = "https://public-api.leexi.ai";
const VERSION_PATH = "/v1";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 300;

const EXTENSION_OPTIONS = [
  ".mp4",
  ".mkv",
  ".avi",
  ".webm",
  ".mov",
  ".wmv",
  ".mpg",
  ".mpeg",
  ".mp3",
  ".wav",
  ".aac",
  ".flac",
  ".ogg",
  ".m4a",
  ".wma",
  ".opus",
  ".aiff",
  ".alac",
  ".amr",
  ".ape",
  ".dts",
  ".ac3",
  ".mid",
  ".mp2",
  ".mpc",
  ".ra",
  ".tta",
  ".vox",
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  EXTENSION_OPTIONS,
};
