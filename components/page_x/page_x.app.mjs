import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "page_x",
  methods: {
    _apiKey() {
      return `${this.$auth.api_key}`;
    },
    _baseUrl() {
      return "https://pagexcrm.p.rapidapi.com/api";
    },
    _headers(data = {}) {
      return {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "x-rapidapi-host": "pagexcrm.p.rapidapi.com",
        "x-rapidapi-key": `${this.$auth.rapidapi_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(data),
        data: {
          ...data,
          api_key: this._apiKey(),
        },
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lead",
        ...opts,
      });
    },
  },
};
