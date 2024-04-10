import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "onstrategy",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.onstrategyapp.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitNewGoalEvent() {
      return this._makeRequest({
        method: "POST",
        path: "/events/new_goal",
      });
    },
  },
};
