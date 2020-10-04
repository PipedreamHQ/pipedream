// Strava API app file
const axios = require("axios");

module.exports = {
  type: "app",
  app: "strava",
  methods: {
    async _makeAPIRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Authorization"] = `Bearer ${this.$auth.oauth_access_token}`;
      opts.headers["Content-Type"] = "application/json";
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://www.strava.com/api/v3${
        path[0] === "/" ? "" : "/"
      }${path}`;
      return await axios(opts);
    },
    async getActivity(id) {
      return (
        await this._makeAPIRequest({
          path: `/activities/${id}`,
        })
      ).data;
    },
    async getAuthenticatedAthlete() {
      return (
        await this._makeAPIRequest({
          path: "/athlete",
        })
      ).data;
    },
  },
};
