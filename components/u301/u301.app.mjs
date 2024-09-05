import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "u301",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL to be shortened",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the URL",
    },
    perPage: {
      type: "integer",
      label: "perPage",
      description: "Results per page",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page of the list",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "QR code width",
      optional: true,
    },
    margin: {
      type: "integer",
      label: "Margin",
      description: "QR code padding",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.u301.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async shortenLink(args = {}) {
      return this._makeRequest({
        path: "/shorten",
        ...args,
      });
    },
    async listDomains(args = {}) {
      return this._makeRequest({
        path: "/shorten-domains",
        ...args,
      });
    },
    async createQrCode(args = {}) {
      return this._makeRequest({
        path: "/qrcode",
        ...args,
      });
    },
  },
};
