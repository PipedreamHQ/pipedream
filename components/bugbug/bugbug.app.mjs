import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bugbug",
  propDefinitions: {
    suite: {
      type: "string",
      label: "Suite",
      description: "The suite that will be run in the bugbug cloud",
      required: true,
    },
    test: {
      type: "string",
      label: "Test",
      description: "The test that will be run in the bugbug cloud",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bugbug.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async runSuite(suite) {
      return this._makeRequest({
        method: "POST",
        path: `/suites/${suite}/run`,
      });
    },
    async runTest(test) {
      return this._makeRequest({
        method: "POST",
        path: `/tests/${test}/run`,
      });
    },
    async getFailedCloudRuns() {
      return this._makeRequest({
        path: "/cloudRuns?status=failed",
      });
    },
    async getFailedSuite(suite) {
      return this._makeRequest({
        path: `/suites/${suite}/status?status=failed`,
      });
    },
    async getFailedTest(test) {
      return this._makeRequest({
        path: `/tests/${test}/status?status=failed`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
