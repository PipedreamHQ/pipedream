const API_PLACEHOLDER = "{api}";
const BASE_URL = `https://${API_PLACEHOLDER}.loopmessage.com`;
const VERSION_PATH = "/api/v1";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const AUTH_HEADER = "authHeader";

const API = {
  SERVER: "server",
  LOOKUP: "lookup",
};

const SERVICES = [
  "imessage",
  "sms",
];

const EFFECTS = [
  "slam",
  "loud",
  "gentle",
  "invisibleInk",
  "echo",
  "spotlight",
  "balloons",
  "confetti",
  "love",
  "lasers",
  "fireworks",
  "shootingStar",
  "celebration",
];

const REACTIONS = [
  "love",
  "like",
  "dislike",
  "laugh",
  "exlaim",
  "question",
  "-love",
  "-like",
  "-dislike",
  "-laugh",
  "-exlaim",
  "-question",
];

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  AUTH_HEADER,
  SERVICES,
  EFFECTS,
  REACTIONS,
  API,
  API_PLACEHOLDER,
};
