import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdf_app_net",
  propDefinitions: {
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdf-app.net";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    compressPdf(opts = {}) {
      return this._makeRequest({
        path: "/compress_PDF",
        ...opts,
      });
    },
    imageToPdf(opts = {}) {
      return this._makeRequest({
        path: "/image_to_pdf",
        ...opts,
      });
    },
    splitPdf(opts = {}) {
      return this._makeRequest({
        path: "/splitt_PDF",
        ...opts,
      });
    },
  },
};
