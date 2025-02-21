import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "real_id",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address for initiating the ID check",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number for initiating the ID check",
      optional: true,
    },
    checkId: {
      type: "string",
      label: "ID Check Identifier",
      description: "The unique identifier for the ID check",
    },
  },
  methods: {
    getUrl(path) {
      return `https://real-id.getverdict.com/api/v1${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
  },
};
