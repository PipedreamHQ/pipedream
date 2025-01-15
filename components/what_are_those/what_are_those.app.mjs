import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "what_are_those",
  methods: {
    _headers(headers = {}) {
      return {
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, headers, ...opts
    }) {
      return axios($, {
        headers: this._headers(headers),
        ...opts,
      });
    },
    identifySneakers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://ayq6s37rv6.execute-api.us-east-1.amazonaws.com/Prod/rec?data_type=multi",
        ...opts,
      });
    },
    gradeAuthenticateSneakers(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://6mdt6kw7ig.execute-api.us-east-1.amazonaws.com/Prod/list?data_type=multi",
        ...opts,
      });
    },
    identifySneakersFromSizeTag(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://0blrzg7ahc.execute-api.us-east-1.amazonaws.com/Prod/sku",
        ...opts,
      });
    },
  },
};
