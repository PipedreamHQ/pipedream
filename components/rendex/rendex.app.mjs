import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rendex",
  propDefinitions: {
    html: {
      type: "string",
      label: "HTML",
      description: "The HTML markup to render to an image.",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "A page URL to render (alternative to HTML). Provide either `html` or `url`.",
      optional: true,
    },
    format: {
      type: "string",
      label: "Output Format",
      description: "The output format of the render.",
      optional: true,
      default: "png",
      options: [
        "png",
        "jpeg",
        "webp",
        "pdf",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rendex.dev";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    // POST /v1/screenshot/json -> { success, data: { image: <base64>, format, bytesSize, ... }, meta }
    renderJson(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/screenshot/json",
        ...opts,
      });
    },
  },
};
