import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshservice",
  propDefinitions: {},
  methods: {
    _domain() {
      return this.$auth.domain;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return `https://${this._domain()}.freshservice.com/api`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: "X",
        },
        ...args,
      });
    },
    async getTickets(args = {}) {
      return this._makeRequest({
        path: "/v2/tickets",
        ...args,
      });
    },
  },
};
