const BASE_URL = "https://api.scale.com";
const VERSION_PATH = "/v1";
const DEFAULT_MAX = 600;
const SEP = "_";

const FIELD_CHOICE_TYPE = {
  CATEGORY: "category",
};

const ATTACHMENT_TYPE = {
  PDF: "pdf",
  IMAGE: "image",
  TEXT: "text",
  VIDEO: "video",
  WEBSITE: "website",
  AUDIO: "audio",
};

const FEATURE_TYPE = {
  TEXT: "text",
  BLOCK: "block",
  GROUP: "group",
};

const GEOMETRY_TYPE = {
  BOX: "box",
  POLYGON: "polygon",
};

const CONTENT_FLAG = {
  LINE: "line",
  KEY: "key",
  VALUE: "value",
  THEAD: "thead",
  TBODY: "tbody",
  DATE: "date",
  MONEY: "money",
  CHECKBOX: "checkbox",
  REGION: "region",
  QUERY: "query",
  SPAN: "span",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  SEP,
  FIELD_CHOICE_TYPE,
  ATTACHMENT_TYPE,
  FEATURE_TYPE,
  GEOMETRY_TYPE,
  CONTENT_FLAG,
};
