import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bugbug",
  propDefinitions: {
    suite: {
      type: "string",
      label: "Suite",
      description: "The suite that will be run in the BugBug Cloud",
      optional: true,
      async options({ page }) {
        const { results } = await this.listSuites({
          params: {
            page: page + 1,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    test: {
      type: "string",
      label: "Test",
      description: "The test that will be run in the BugBug Cloud",
      optional: true,
      async options({ page }) {
        const { results } = await this.listTests({
          params: {
            page: page + 1,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.bugbug.io/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    getSuiteRun({
      suiteRunId, ...opts
    }) {
      return this._makeRequest({
        path: `/suiteruns/${suiteRunId}/`,
        ...opts,
      });
    },
    listSuites(opts = {}) {
      return this._makeRequest({
        path: "/suites/",
        ...opts,
      });
    },
    listTests(opts = {}) {
      return this._makeRequest({
        path: "/tests/",
        ...opts,
      });
    },
    listTestRuns(opts = {}) {
      return this._makeRequest({
        path: "/testruns/",
        ...opts,
      });
    },
  },
};
