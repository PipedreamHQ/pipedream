import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fitbit",
  propDefinitions: {},
  methods: {
    _getDateOrToday(date) {
      return date || new Date().toISOString().slice(0, 10);
    },
    _getHeaders(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    _getUrl(path) {
      return `https://api.fitbit.com${path}`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      return axios($ ?? this, {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      });
    },
    async getActivitySummary({
      date,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/activities/date/${date}.json`,
        ...args,
      });
    },
    async getDailySteps({
      date, ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/activities/steps/date/${date}/1d.json`,
        ...args,
      });
    },
    async getWeightLogs({
      date, ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/body/log/weight/date/${date}.json`,
        ...args,
      });
    },
    async getSleep({
      date,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1.2/user/-/sleep/date/${date}.json`,
        ...args,
      });
    },
    async getNutritionLogs({
      date,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/foods/log/date/${date}.json`,
        ...args,
      });
    },
    async getWaterLogs({
      date,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/1/user/-/foods/log/water/date/${date}.json`,
        ...args,
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
