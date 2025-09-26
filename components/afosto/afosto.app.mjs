import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "afosto",
  propDefinitions: {
    cartId: {
      type: "string",
      label: "Cart ID",
      description: "The ID of the cart",
    },
  },
  methods: {
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.auth_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _baseUrl() {
      return "https://afosto.app/graphql";
    },
    _makeRequest({
      $ = this, path = "", headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    query(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
  },
};
