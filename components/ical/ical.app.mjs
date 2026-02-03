import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ical",
  propDefinitions: {},
  methods: {
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this.$auth.url}${path}`,
        ...args,
      });
    },
    async getEvents(args = {}) {
      return this._makeRequest({
        path: "/",
        ...args,
      });
    },
  },
};
