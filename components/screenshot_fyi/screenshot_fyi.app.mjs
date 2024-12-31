import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "screenshot_fyi",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage to capture",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the screenshot",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the screenshot",
      optional: true,
    },
    fullpage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the full page of the webpage",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the screenshot (e.g., png, jpeg)",
      optional: true,
    },
    disableCookieBanners: {
      type: "boolean",
      label: "Disable Cookie Banners",
      description: "Disable cookie banners in the screenshot",
      optional: true,
    },
    darkMode: {
      type: "boolean",
      label: "Dark Mode",
      description: "Enable dark mode in the screenshot",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://screenshot.fyi/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/take",
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
        params,
        ...otherOpts,
      });
    },
    async takeScreenshot() {
      const params = {
        url: this.url,
        ...(this.width !== undefined && {
          width: this.width,
        }),
        ...(this.height !== undefined && {
          height: this.height,
        }),
        ...(this.fullpage !== undefined && {
          fullpage: this.fullpage,
        }),
        ...(this.format && {
          format: this.format,
        }),
        ...(this.disableCookieBanners !== undefined && {
          disableCookieBanners: this.disableCookieBanners,
        }),
        ...(this.darkMode !== undefined && {
          darkMode: this.darkMode,
        }),
      };
      return this._makeRequest({
        params,
      });
    },
  },
  version: "0.0.{{ts}}",
};
