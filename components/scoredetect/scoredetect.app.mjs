import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "scoredetect",
  propDefinitions: {
    fileOrUrl: {
      type: "string",
      label: "File or URL",
      description: "Provide the file path for local files or the URL for remote files.",
      required: true,
    },
    textToCertify: {
      type: "string",
      label: "Text to Certify",
      description: "Provide the text to be certified.",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.scoredetect.com";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createCertificate(args) {
      return this._makeRequest({
        method: "POST",
        path: "/create-certificate",
        ...args,
      });
    },
  },
};
