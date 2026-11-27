const BASE_URL = "https://api.shotstack.io";
const VERSION_PLACEHOLDER = "{version}";

const API = {
  EDIT: `/edit/${VERSION_PLACEHOLDER}`,
  INGEST: `/ingest/${VERSION_PLACEHOLDER}`,
};

const ORIGIN = "pipedream";
const USER_AGENT = "shotstack-pipedream/0.1.0";

const POLL_MS = 5000;
// MCP clients on the official SDK give up on a tool call after 60 s by default.
const MAX_WAIT_SECONDS = 50;

const SEP = "_";

const ASSET_TYPE = {
  VIDEO: "video",
  AUDIO: "audio",
  IMAGE: "image",
  TITLE: "title",
  LUMA: "luma",
  HTML: "html",
};

const OUTPUT_FORMAT = {
  MP4: {
    label: "MP4 video file",
    value: "mp4",
  },
  GIF: {
    label: "Animated GIF",
    value: "gif",
  },
  JPG: {
    label: "JPG image file",
    value: "jpg",
  },
  PNG: {
    label: "PNG image file",
    value: "png",
  },
  BMP: {
    label: "BMP image file",
    value: "bmp",
  },
  MP3: {
    label: "MP3 audio file (audio only)",
    value: "mp3",
  },
};

const OUTPUT_RESOLUTION = {
  PREVIEW: {
    label: "Preview - 512px x 288px @ 15fps",
    value: "preview",
  },
  MOBILE: {
    label: "Mobile - 640px x 360px @ 25fps",
    value: "mobile",
  },
  SD: {
    label: "SD - 1024px x 576px @ 25fps",
    value: "sd",
  },
  HD: {
    label: "HD - 1280px x 720px @ 25fps",
    value: "hd",
  },
  ["1080"]: {
    label: "1080 - 1920px x 1080px @ 25fps",
    value: "1080",
  },
};

const SOUNDTRACK_EFFECT = {
  FADEIN: {
    label: "Fade volume in only",
    value: "fadeIn",
  },
  FADEOUT: {
    label: "Fade volume out only",
    value: "fadeOut",
  },
  FADEINFADEOUT: {
    label: "Fade volume in and out",
    value: "fadeInFadeOut",
  },
};

export default {
  BASE_URL,
  VERSION_PLACEHOLDER,
  API,
  ORIGIN,
  USER_AGENT,
  POLL_MS,
  MAX_WAIT_SECONDS,
  SEP,
  ASSET_TYPE,
  OUTPUT_FORMAT,
  OUTPUT_RESOLUTION,
  SOUNDTRACK_EFFECT,
};
