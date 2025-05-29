import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "drimify",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of the application",
    },
    timeFrame: {
      type: "string",
      label: "Time Frame",
      description: "Optional time frame to specify data collection period (YYYY-MM-DDTHH:MM:SS)",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://endpoint.drimify.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.apiKey}`,
        },
      });
    },
    async listAppDataCollections({
      applicationId, page = 1, createdSince,
    } = {}) {
      const params = {
        app: applicationId,
        page,
      };
      if (createdSince) {
        params.createdSince = createdSince;
      }
      return this._makeRequest({
        path: "/appdatacollection",
        params,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let page = 1;
      while (true) {
        const response = await fn({
          ...opts,
          page,
        });
        if (response.length === 0) break;
        results.push(...response);
        page++;
      }
      return results;
    },
    emitNewEvent(applicationId, timeFrame) {
      console.log(`New event collected for application ID: ${applicationId}, within time frame: ${timeFrame}`);
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
