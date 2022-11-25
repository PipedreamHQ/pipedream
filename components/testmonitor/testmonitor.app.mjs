import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "testmonitor",
  propDefinitions: {
    filter: {
      type: "object",
      label: "Filter",
      description: "Filters for issues. Refer to [Using filters](https://docs.testmonitor.com/#section/Requests/Filtering) for more information. Refer to [Custom fields](https://docs.testmonitor.com/#tag/Custom-Fields) on how to filter on custom field values.",
    },
    issueId: {
      type: "integer",
      label: "Issue ID",
      description: "The issue identifier.",
      async options({
        projectId, page,
      }) {
        const { data: issues } = await this.getIssues({
          page: page + 1,
          project_id: projectId,
        });
        return issues.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    order: {
      type: "object",
      label: "Order",
      description: "Sort result set. Refer to [Using sorters](https://docs.testmonitor.com/#section/Requests/Sorting).",
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return.",
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The project identifier.",
      async options({ page }) {
        const { data: projects } = await this.getProjects({
          page: page + 1,
        });
        return projects.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "The [search query](https://docs.testmonitor.com/#section/Requests/Searching).",
    },
    testResultId: {
      type: "integer",
      label: "Test Result ID",
      description: "The test result identifier.",
      async options({
        projectId, page,
      }) {
        const { data: testResults } = await this.getTestResults({
          page: page + 1,
          project_id: projectId,
        });
        return testResults.map(({
          id: value, code: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    with: {
      type: "string[]",
      label: "With",
      description: "Include object relations. Refer to [Using relations](https://docs.testmonitor.com/#section/Requests/Relations).",
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.domain}.testmonitor.com/api/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getIssue({
      $, issueId,
    }) {
      return this._makeRequest({
        $,
        path: `issues/${issueId}`,
      });
    },
    getIssues(params) {
      return this._makeRequest({
        path: "issues",
        params,
      });
    },
    getProject({
      $, projectId,
    }) {
      return this._makeRequest({
        $,
        path: `projects/${projectId}`,
      });
    },
    getProjects(params) {
      return this._makeRequest({
        path: "projects",
        params,
      });
    },
    getTestResult({
      $, testResultId,
    }) {
      return this._makeRequest({
        $,
        path: `test-results/${testResultId}`,
      });
    },
    getTestResults(params) {
      return this._makeRequest({
        path: "test-results",
        params,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          meta: {
            current_page, last_page,
          },
        } = await fn(params);
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(current_page == last_page);

      } while (lastPage);
    },
  },
};
