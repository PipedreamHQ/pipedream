import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "csvbox",
  propDefinitions: {
    sheetLicenseKey: {
      type: "string",
      label: "Sheet License Key",
      description: "The unique identifier for your CSVBox sheet. You can find it in **Sheets - Edit - Code Snippet - Sheet License Key**.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user. You can find it in the **Dashboard - Edit - Code Snippet**.",
      optional: true,
    },
    hasHeaders: {
      type: "boolean",
      label: "Has Headers",
      description: "Whether the spreadsheet has headers.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.csvbox.io/1.1${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "x-csvbox-api-key": `${this.$auth.api_key}`,
        "x-csvbox-secret-api-key": `${this.$auth.secret_api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...args,
      });
    },
    submitFile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/file",
        ...args,
      });
    },
  },
};
