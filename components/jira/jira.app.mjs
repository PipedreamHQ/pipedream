import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    projectId: {
      label: "Project ID",
      description: "The ID of the project",
      type: "string",
      async options() {
        const projects = await this.getProjects();

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    issueId: {
      label: "Issue ID",
      description: "The ID of the issue",
      type: "string",
      async options({ projectId }) {
        const issues = await this.getIssues({
          projectId,
        });

        return issues.map((issue) => ({
          label: issue.key,
          value: issue.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _jiraApiUrl() {
      return "https://api.atlassian.com/ex/jira";
    },
    _atlassianApiUrl() {
      return "https://api.atlassian.com";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${await this._jiraApiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
          ...options.headers,
        },
        ...options,
      });
    },
    async getProjects() {
      return this._makeRequest("", {
        url: `${this._atlassianApiUrl()}/oauth/token/accessible-resources`,
      });
    },
    async getIssues({
      projectId, $,
    }) {
      const response = await this._makeRequest(`${projectId}/rest/api/3/search`, {}, $);

      return response.issues;
    },
    async createIssue({
      projectId, params, data, $,
    }) {
      return this._makeRequest(`${projectId}/rest/api/3/issue`, {
        method: "post",
        params,
        data,
      }, $);
    },
    async createIssueAttachment({
      projectId, issueId, data, $,
    }) {
      return this._makeRequest(`${projectId}/rest/api/3/issue/${issueId}/attachments`, {
        method: "post",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          "X-Atlassian-Token": "no-check",
        },
        data,
      }, $);
    },
    async createIssueComment({
      projectId, issueId, params, data, $,
    }) {
      return this._makeRequest(`${projectId}/rest/api/3/issue/${issueId}/comment`, {
        method: "post",
        params,
        data,
      }, $);
    },
  },
};
