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
    _makeRequest(opts = {}) {
      const {
        $ = this,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "POST",
        url: `https://e.customjs.io/__js1-${this.$auth.api_key}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      });
    },
    convertHtmlToPdf(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "zapier/generatePDF",
        },
        ...opts,
      });
    },
    createScreenshot(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "zapier/screenshot",
        },
        ...opts,
      });
    },
    mergePdfs(opts = {}) {
      return this._makeRequest({
        headers: {
          "customjs-origin": "zapier/mergePDFs",
        },
        ...opts,
      });
    },
  },
};
