// Strava API app file
const axios = require("axios");
const { axios: PlatformAxios } = require("@pipedream/platform");
module.exports = {
  type: "app",
  app: "strava",
  methods: {
    prepareOpts(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers["Authorization"] = `Bearer ${this.$auth.oauth_access_token}`;
      opts.headers["Content-Type"] = "application/json";
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://www.strava.com/api/v3${
        path[0] === "/" ?
          "" :
          "/"
      }${path}`;
      return opts;
    },
    makeQueryString(params) {
      return Object.keys(params).length ?
        `?${Object.keys(params)
          .map((k) => k + "=" + params[k])
          .join("&")}` :
        "";
    },
    async _makeAPIRequest(opts) {
      return await axios(this.prepareOpts(opts));
    },
    async _makeAPIRequestWithPlatform($, opts) {
      return await PlatformAxios($, this.prepareOpts(opts));
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
    async createNewActivity($, data) {
      return (
        await this._makeAPIRequestWithPlatform($, {
          method: "POST",
          path: "/activities",
          data,
        })
      );
    },
    async getActivityById($, data) {
      const {
        id,
        ...dataRest
      } = data;
      return (
        await this._makeAPIRequestWithPlatform($, {
          method: "GET",
          path: `/activities/${id}${this.makeQueryString(dataRest)}`,
        })
      );
    },
    async listActivities($, data) {
      return (
        await this._makeAPIRequestWithPlatform($, {
          method: "GET",
          path: `/activities${this.makeQueryString(data)}`,
        })
      );
    },
    async updateActivity($, data) {
      const {
        id,
        ...dataRest
      } = data;
      return (
        await this._makeAPIRequestWithPlatform($, {
          method: "PUT",
          path: `/activities/${id}`,
          data: dataRest,
        })
      );
    },
    async getStats($, data) {
      const { id } = data;
      return (
        await this._makeAPIRequestWithPlatform($, {
          method: "GET",
          path: `/athletes/${id}/stats`,
        })
      );
    },
  },
};
