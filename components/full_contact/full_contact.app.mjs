import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "full_contact",
  propDefinitions: {},
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.fullcontact.com/v3";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async enrichPerson({ ...args }) {
      return this._makeRequest({
        path: "/person.enrich",
        method: "post",
        ...args,
      });
    },
  },
};
