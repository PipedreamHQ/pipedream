import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    projectID: {
      type: "string",
      label: "Project ID",
      description: "The project ID.",
      async options() {
        const resp = await this._makeRequest({
          method: "GET",
          path: "/project",
        });
        return resp.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    issueType: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue, [Check the API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post) to see available options",
      async options({ projectID }) {
        const resp = await this._makeRequest({
          method: "GET",
          path: "/issue/createmeta",
          params: {
            projectIds: projectID,
          },
        });
        // Because we select a project, we get issue types for only that and only one project
        return resp.projects[0].issuetypes.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    issueIdOrKey: {
      type: "string",
      label: "Issue id or key",
      description: "The ID or key of the issue where the attachment will be added to.",
    },
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The account ID of the user, which uniquely identifies the user across all Atlassian products, For example, `5b10ac8d82e05b22cc7d4ef5`, ",
    },
  },
  methods: {
    parseObject(obj) {
      for (let o in obj) {
        try {
          obj[o] = JSON.parse(obj[o]);
        } catch (err) {
          // do nothing, if cannot parsed as json, it must remain the same.
        }
      }
      return obj;
    },
    async _getCloudId($) {
      // First we must make a request to get our the cloud instance ID tied
      // to our connected account, which allows us to construct the correct REST API URL.
      // See Section 3.2 of
      // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
      const resp = await axios($ ?? this, {
        url: "https://api.atlassian.com/oauth/token/accessible-resources",
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
      // Assumes the access token has access to a single instance
      return resp[0].id;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "user-agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _getUrl($, path) {
      const cloudId = await this._getCloudId($);
      return `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3${path}`;
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: await this._getUrl($, path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async assignIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/assignee`,
        ...args,
      });
    },
    async addWatcher({
      issueIdOrKey,
      accountId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/watchers`,
        data: `"${accountId}"`,
        ...args,
      });
    },
    async addAttachmentToIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/attachments`,
        ...args,
      });
    },
    async addCommentToIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    async createIssue({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/issue",
        ...args,
      });
    },
    async createVersion({ ...args } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/version",
        ...args,
      });
    },
    async deleteProject({
      projectIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "DELETE",
        path: `/project/${projectIdOrKey}`,
        ...args,
      });
    },
    async getAllProjects({ ...args } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/project",
        ...args,
      });
    },
    async getIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
    async getTask({
      taskId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/task/${taskId}`,
        ...args,
      });
    },
    async getTransitions({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    async getUser({
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: "/user",
        ...args,
      });
    },
    async listIssueComments({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "GET",
        path: `/issue/${issueIdOrKey}/comment`,
        ...args,
      });
    },
    async transitionIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "POST",
        path: `/issue/${issueIdOrKey}/transitions`,
        ...args,
      });
    },
    async updateComment({
      issueIdOrKey,
      commentId,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}/comment/${commentId}`,
        ...args,
      });
    },
    async updateIssue({
      issueIdOrKey,
      ...args
    } = {}) {
      return await this._makeRequest({
        method: "PUT",
        path: `/issue/${issueIdOrKey}`,
        ...args,
      });
    },
  },
};
