const BASE_URL = "https://api.signalraven.ai";
const VERSION_PATH = "/api/v1";
const TOKEN_URL = "https://auth.signalraven.ai/oauth2/token";

const READ_SCOPES = [
  "read:signals",
  "read:sources",
  "read:watchlist",
  "read:icp",
  "read:intelligence",
  "read:usage",
];

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export default {
  BASE_URL,
  VERSION_PATH,
  TOKEN_URL,
  READ_SCOPES,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
