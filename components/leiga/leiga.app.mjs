import {
  ConfigurationError, axios,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "leiga",
  propDefinitions: {
    issueTypeId: {
      type: "string",
      label: "Issue Type ID",
      description: "The Issue Type ID in which you wish to create issue.",
      async options({ projectId }) {
        const { data } = await this.listIssueTypes({
          params: {
            projectId,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The project ID in which you wish to monitor for new issues.",
      async options() {
        const { data } = await this.listProjects();

        return data.map(({
          id: value, pname: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.leiga.com/openapi/api";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "accessToken": `${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherOpts,
      });
    },
    validateRequest(response) {
      if (response.msg) {
        throw new ConfigurationError(response.msg);
      }
      return response;
    },
    getIssueSchema(opts = {}) {
      return this._makeRequest({
        path: "/issue/issue-scheme",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook/add",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhook/delete",
        ...opts,
      });
    },
    async listIssueTypes(opts = {}) {
      const response = await this._makeRequest({
        path: "/issue/type-list",
        ...opts,
      });
      return this.validateRequest(response);
    },
    async listProjects() {
      const response = await this._makeRequest({
        path: "/project/list",
      });
      return this.validateRequest(response);
    },
    async listWebhookEvents(opts = {}) {
      const response = await this._makeRequest({
        path: "/webhook/list-events",
        ...opts,
      });
      return this.validateRequest(response);
    },
    createIssue(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/issue/add",
        ...opts,
      });
    },
  },
};
