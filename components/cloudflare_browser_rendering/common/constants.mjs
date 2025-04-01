const BASE_URL = "https://api.cloudflare.com";
const VERSION_PATH = "/client/v4";
const ACCOUNT_PLACEHOLDER = "{account_id}";
const BROWSER_RENDERING_PATH = `/accounts/${ACCOUNT_PLACEHOLDER}/browser-rendering`;

export default {
  BASE_URL,
  VERSION_PATH,
  BROWSER_RENDERING_PATH,
  ACCOUNT_PLACEHOLDER,
};
