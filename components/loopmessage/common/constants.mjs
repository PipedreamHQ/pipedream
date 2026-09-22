const BASE_URL = "https://pipedream-api.loopmessage.com";
const VERSION_PATH = "/api/v1";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const AUTH_HEADER = "authHeader";

const SERVICES = [
  "imessage",
  "sms",
  "whatsapp",
  "rcs",
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
  "emphasize",
  "question",
  "-love",
  "-like",
  "-dislike",
  "-laugh",
  "-emphasize",
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
};
