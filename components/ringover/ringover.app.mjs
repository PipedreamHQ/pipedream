import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ringover",
  propDefinitions: {
    number: {
      type: "integer",
      label: "Number",
      description: "International number format (E.164)",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.server}.ringover.com/v2`;
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `${this.$auth.api_key}`,
          "Accept": "application/json",
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
  },
};
