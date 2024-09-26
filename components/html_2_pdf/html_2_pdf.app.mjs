import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "html_2_pdf",
  propDefinitions: {
    source: {
      type: "string",
      label: "Source Type",
      description: "Indicates whether the input is a URL or HTML string.",
      options: [
        {
          label: "URL",
          value: "url",
        },
        {
          label: "HTML",
          value: "html",
        },
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The URL or HTML string to convert to PDF.",
    },
    licenseKey: {
      type: "string",
      label: "License Key",
      description: "Your HTML2PDF license key.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.html2pdf.co.uk";
    },
    _params(params) {
      return {
        ...params,
        "license": `${this.$auth.license_key}`,
      };
    },
    _makeRequest({
      $ = this, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: this._params(params),
        ...opts,
      });
    },
    async createPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};
