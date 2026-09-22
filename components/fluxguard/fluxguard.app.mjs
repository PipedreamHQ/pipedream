import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fluxguard",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.fluxguard.com";
    },
    _headers() {
      return {
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createHook({
      url,
      ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: "/account/webhook",
        data: {
          url,
        },
        ...opts,
      });
    },
    deleteHook({
      id,
      ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: "/account/webhook",
        data: {
          id,
        },
        ...opts,
      });
    },
  },
};
