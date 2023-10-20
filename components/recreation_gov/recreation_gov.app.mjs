import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import { states } from "./common/constants.mjs";

export default {
  type: "app",
  app: "recreation_gov",
  propDefinitions: {
    recAreaId: {
      type: "string",
      label: "Recreation Area Id",
      description: "Recreation Area Id",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getRecAreas,
          page,
          resourceKey: "RECDATA",
          labelVal: {
            label: "RecAreaName",
            value: "RecAreaID",
          },
        });
      },
    },
    campsiteId: {
      type: "string",
      label: "Campsite Id",
      description: "Campsite Id",
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getCampsites,
          page,
          resourceKey: "RECDATA",
          labelVal: {
            label: "CampsiteName",
            value: "CampsiteID",
          },
        });
      },
    },
    activities: {
      type: "integer[]",
      label: "Activities",
      description: "Activity Ids",
      optional: true,
      async options({ page }) {
        return utils.asyncPropHandler({
          resourceFn: this.getActivities,
          page,
          resourceKey: "RECDATA",
          labelVal: {
            label: "ActivityName",
            value: "ActivityID",
          },
        });
      },
    },
    states: {
      type: "string[]",
      label: "States",
      description: "Two-letter state abbreviations",
      optional: true,
      options: states,
    },
  },
  methods: {
    _getUrl(path) {
      return `https://ridb.recreation.gov/api/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, params, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        params: {
          apikey: this.$auth.api_key,
          ...params,
        },
        ...otherConfig,
      };
      console.log("axios config", config);
      return axios($ ?? this, config);
    },
    async getCampsites(args = {}) {
      return this._makeRequest({
        path: "/campsites",
        ...args,
      });
    },
    async getCampsite({
      campsiteId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/campsites/${campsiteId}`,
        ...args,
      });
    },
    async getRecAreas(args = {}) {
      return this._makeRequest({
        path: "/recareas",
        ...args,
      });
    },
    async getRecArea({
      recAreaId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/recareas/${recAreaId}`,
        ...args,
      });
    },
    async getActivities(args = {}) {
      return this._makeRequest({
        path: "/activities",
        ...args,
      });
    },
  },
};
