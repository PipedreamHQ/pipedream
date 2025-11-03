import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "screenshotbase",
  propDefinitions: {
    url: {
      label: "URL",
      type: "string",
      description: "Website to render",
    },
    filename: {
      type: "string",
      label: "Target Filename",
      description: "The filename (including extension) that will be used to save the file in /tmp",
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the image returned",
      options: [
        "jpg",
        "png",
        "webp",
      ],
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "The quality of the image returned. Only supported when the format is `jpg` or `jpeg`",
      optional: true,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Whether to take a screenshot of the full page",
      optional: true,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "The width of the browser viewport in pixels. The browser's viewport is the window area where you can see the website. Default value is 1280.",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "The height of the browser viewport in pixels. The browser's viewport is the window area where you can see the website. Default value is 800.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.screenshotbase.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "apikey": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    takeScreenshot(opts = {}) {
      return this._makeRequest({
        path: "/take",
        responseType: "arraybuffer",
        ...opts,
      });
    },
  },
};
