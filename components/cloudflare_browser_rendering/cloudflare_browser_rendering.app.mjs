import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloudflare_browser_rendering",
  propDefinitions: {
    html: {
      type: "string",
      label: "HTML",
      description: "Set the content of the page, eg: `<h1>Hello World!!</h1>`.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "URL to navigate to, eg. `https://example.com`.",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport - Height",
      description: "The height of the viewport in pixels.",
      optional: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport - Width",
      description: "The width of the viewport in pixels.",
      optional: true,
    },
    viewportDeviceScaleFactor: {
      type: "integer",
      label: "Viewport - Device Scale Factor",
      description: "The device scale factor.",
      optional: true,
    },
    viewportHasTouch: {
      type: "boolean",
      label: "Viewport - Has Touch",
      description: "Whether the viewport has touch capabilities.",
      optional: true,
    },
    viewportIsLandscape: {
      type: "boolean",
      label: "Viewport - Is Landscape",
      description: "Whether the viewport is in landscape mode.",
      optional: true,
    },
    viewportIsMobile: {
      type: "boolean",
      label: "Viewport - Is Mobile",
      description: "Whether the viewport is in mobile mode.",
      optional: true,
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "Specify the browser user agent",
      optional: true,
    },
    additionalSettings: {
      type: "object",
      label: "Additional Settings",
      description: "Specify additional settings for the browser rendering.",
      optional: true,
    },
  },
  methods: {
    getAccountId() {
      return this.$auth.account_id;
    },
    getUrl(path) {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}${constants.BROWSER_RENDERING_PATH}`
        .replace(constants.ACCOUNT_PLACEHOLDER, this.getAccountId());
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    getParams(params) {
      return {
        account_id: this.getAccountId(),
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        params: this.getParams(params),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
