import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mojo_helpdesk",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.mojohelpdesk.com/api/v2";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: {
          ...params,
          access_key: this.$auth.access_key,
        },
        ...args,
      };
      return axios($, config);
    },
    listTickets(args = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
  },
};
