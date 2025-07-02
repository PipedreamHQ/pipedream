import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "testlocally",
  propDefinitions: {
    servers: {
      type: "string[]",
      label: "Servers",
      description: "The servers to use for the test.",
      async options() {
        const servers = await this.listServers();
        return servers?.map(({ name }) => name) || [];
      },
    },
    testId: {
      type: "string",
      label: "Test ID",
      description: "The ID of the test to retrieve.",
      async options({ page }) {
        const tests = await this.listTests({
          params: {
            page,
          },
        });
        return tests?.map(({
          id: value, target, browser, viewport,
        }) => ({
          value,
          label: `${target} - ${browser} - ${viewport.requested}`,
        })) || [];
      },
    },
    owners: {
      type: "string[]",
      label: "Owners",
      description: "A list of userIds of the owners of the tests to retrieve",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "A list of locations of the tests to retrieve",
      optional: true,
    },
    target: {
      type: "string",
      label: "Target",
      description: "The target URL of the tests to retrieve",
      optional: true,
    },
    scheduled: {
      type: "string",
      label: "Scheduled",
      description: "The scheduled status of the tests to retrieve. Values: 'yes', 'no', or a specific schedule ID",
      optional: true,
    },
    browser: {
      type: "string",
      label: "Browser",
      description: "The browser of the tests to retrieve",
      options: [
        "chromium",
        "chrome",
        "firefox",
        "msedge",
        "webkit",
      ],
      optional: true,
    },
    viewport: {
      type: "string",
      label: "Viewport",
      description: "The viewport of the tests to retrieve",
      options: [
        "desktop",
        "tablet",
        "phone",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://testlocal.ly/api/v0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          Accept: "application/json",
        },
        ...opts,
      });
    },
    getTest({
      testId, ...opts
    }) {
      return this._makeRequest({
        path: `/tests/${testId}`,
        ...opts,
      });
    },
    listServers(opts = {}) {
      return this._makeRequest({
        path: "/servers",
        ...opts,
      });
    },
    listTests(opts = {}) {
      return this._makeRequest({
        path: "/tests",
        ...opts,
      });
    },
    runTest(opts = {}) {
      return this._makeRequest({
        path: "/tests",
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          page: 0,
          limit: 100,
        },
      };
      let total, count = 0;
      do {
        const results = await fn(args);
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = results.total;
        args.params.page++;
      } while (total === args.params.limit);
    },
  },
};
