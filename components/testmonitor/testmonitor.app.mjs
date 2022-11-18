import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "testmonitor",
  propDefinitions: {
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
      fn, params = {},
    }) {
      let lastPage = false;
      do {
        const {
          data,
          meta: { last_page },
        } = await fn(params);
        for (const d of data) {
          yield d;
        }

        lastPage = !last_page;
      } while (lastPage);
    },
  },
};
