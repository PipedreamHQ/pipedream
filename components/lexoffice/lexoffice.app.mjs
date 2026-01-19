import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lexoffice",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.lexware.io/v1";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    uploadFile({
      voucherId,
      ...opts
    } = {}) {
      const path = voucherId
        ? `/vouchers/${voucherId}/files`
        : "/files";
      return this._makeRequest({
        path,
        method: "POST",
        ...opts,
      });
    },
  },
};
