import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "customjs",
  propDefinitions: {
    filename: {
      type: "string",
      label: "Filename",
      description: "Download the file to the `/tmp` directory with the specified filename.",
    },
  },
  methods: {
    _getBaseHeaders() {
      return {
        "Content-Type": "application/json",
        "customjs-origin": "pipedream",
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        headers = {},
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method: "POST",
        url: `https://e.customjs.io/__js1-${this.$auth.api_key}`,
        headers: {
          ...this._getBaseHeaders(),
          ...headers,
        },
        responseType: "arraybuffer",
      });
    },
    convertHtmlToPdf(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "pipedream/generatePDF",
        },
        ...opts,
      });
    },
    convertHtmlToPng(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "pipedream/generatePNG",
        },
        ...opts,
      });
    },
    createScreenshot(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "pipedream/screenshot",
        },
        ...opts,
      });
    },
    mergePdfs(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "pipedream/mergePDFs",
        },
        ...opts,
      });
    },
    runPuppeteer(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "pipedream/puppeteer",
        },
        ...opts,
      });
    },
  },
};
