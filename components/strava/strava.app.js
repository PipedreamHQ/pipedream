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
      return await this._makeAPIRequestWithPlatform($, {
        method: "POST",
        path: "/activities",
        data,
      });
    },
    async getActivityById($, data) {
      const {
        activityId,
        ...dataRest
      } = data;
      return await this._makeAPIRequestWithPlatform($, {
        method: "GET",
        path: `/activities/${activityId}`,
        params: dataRest,
      });
    },
    async _listActivitiesOfPage($, data, maxItems, pageSize, results, page) {
      const tempResults = await this._makeAPIRequestWithPlatform($, {
        method: "GET",
        path: "/activities",
        params: {
          ...data,
          page,
          per_page: pageSize,
        },
      });
      if (tempResults.length < pageSize) {
        return [
          ...results,
          ...tempResults,
        ].slice(0, maxItems);
      } else if (tempResults.length + results.length >= maxItems) {
        //integer > undefined always returns false, so it is not checked again if undefined
        return [
          ...results,
          ...tempResults,
        ].slice(0, maxItems);
      } else {
        return this._listActivitiesOfPage(
          $,
          data,
          maxItems,
          pageSize,
          [
            ...results,
            ...tempResults,
          ],
          page + 1,
        );
      }
    },
    async listActivities($, data) {
      const pageSize = 200;
      const {
        maxItems,
        ...dataRest
      } = data;
      return this._listActivitiesOfPage(
        $,
        dataRest,
        maxItems,
        pageSize,
        [],
        1,
      );
    },
    async updateActivity($, data) {
      const {
        activityId,
        ...dataRest
      } = data;
      return await this._makeAPIRequestWithPlatform($, {
        method: "PUT",
        path: `/activities/${activityId}`,
        data: dataRest,
      });
    },
    async getStats($) {
      const athlete = await this.getAuthenticatedAthlete();
      return await this._makeAPIRequestWithPlatform($, {
        method: "GET",
        path: `/athletes/${athlete.id}/stats`,
      });
    },
  },
};
