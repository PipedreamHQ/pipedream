import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pulsetic",
  propDefinitions: {
    startDt: {
      type: "string",
      label: "Start Date",
      description: "Indicates the start date to filter the results. Format: YYYY-MM-DD",
    },
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The ID of the monitor to retrieve events for",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.pulsetic.com/api/public";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        params,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitEvent({
      monitorId, startDt,
    }) {
      return this._makeRequest({
        path: `/${monitorId}/events`,
        params: {
          start_dt: startDt,
        },
      });
    },
  },
};
