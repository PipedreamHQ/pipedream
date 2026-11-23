export const BASE_URL = "https://api.tinko.com.br/v1";

export const DOCS_URL = "https://docs.tinko.com.br";

export const PAGE_SIZE = 50;

export const MAX_PAGE_SIZE = 100;

export const DEFAULT_MAX_RESULTS = 100;

export const SIGNATURE_TOLERANCE_SECONDS = 300;

export const MESSAGE_TYPES = [
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Video",
    value: "video",
  },
  {
    label: "Audio",
    value: "audio",
  },
  {
    label: "Document",
    value: "document",
  },
  {
    label: "Sticker",
    value: "sticker",
  },
  {
    label: "Contact Card",
    value: "vcard",
  },
  {
    label: "Template",
    value: "template",
  },
];

export const MEDIA_TYPES = [
  "image",
  "video",
  "audio",
  "document",
  "sticker",
];

export const CAPTION_TYPES = [
  "image",
  "video",
  "document",
];

export const CHAT_STATUSES = [
  {
    label: "Waiting",
    value: "waiting",
  },
  {
    label: "In Progress",
    value: "entrance",
  },
  {
    label: "Finished",
    value: "finished",
  },
];

export const CHANNEL_EVENTS = [
  {
    label: "Channel Connected",
    value: "CHANNEL_CONNECTED",
  },
  {
    label: "Channel Disconnected",
    value: "CHANNEL_DISCONNECTED",
  },
];
