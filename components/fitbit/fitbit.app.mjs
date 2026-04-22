import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fitbit",
  propDefinitions: {},
  methods: {
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
    async getHeartRate({
      startDate,
      endDate,
      detailLevel = "1min",
      startTime,
      endTime,
      timezone,
      ...args
    } = {}) {
      let path;
      if (startTime && endTime) {
        path = `/1/user/-/activities/heart/date/${startDate}/${endDate}/${detailLevel}/time/${startTime}/${endTime}.json`;
      } else {
        path = `/1/user/-/activities/heart/date/${startDate}/${endDate}/${detailLevel}.json`;
      }

      const params = {};
      if (timezone) params.timezone = timezone;

      return this._makeRequest({
        method: "GET",
        path,
        params,
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
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
