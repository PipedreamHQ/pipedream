import { axios } from "@pipedream/platform";
import actionConstants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "jira",
  propDefinitions: {
    cloudId: {
      label: "Cloud ID",
      description: "The ID of the cloud",
      type: "string",
      async options() {
        const clouds = await this.getClouds();

        return clouds.map((cloud) => ({
          label: cloud.name,
          value: cloud.id,
        }));
      },
    },
    projectId: {
      label: "Project ID",
      description: "The ID of the project",
      type: "string",
      async options({ cloudId }) {
        const projects = await this.getProjects({
          cloudId,
        });

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
      async options({ cloudId }) {
        const issues = await this.getIssues({
          cloudId,
        });

        return issues.map((issue) => ({
          label: issue.key,
          value: issue.id,
        }));
      },
    },
    transitionId: {
      label: "Issue ID",
      description: "The ID of the transition",
      type: "string",
      async options({
        cloudId, issueId,
      }) {
        const transitions = await this.getTransitions({
          cloudId,
          issueId,
        });

        return transitions.map((transition) => ({
          label: transition.name,
          value: transition.id,
        }));
      },
    },
    accountId: {
      label: "Account ID",
      description: "The ID of the user account",
      type: "string",
      async options({ cloudId }) {
        const users = await this.getUsers({
          cloudId,
        });

        return users.map((user) => ({
          label: user.displayName ?? user.name,
          value: user.accountId,
        }));
      },
    },
    commentId: {
      label: "Comment ID",
      description: "The ID of the comment",
      type: "string",
      async options({
        cloudId, issueId,
      }) {
        const comments = await this.getIssueComments({
          cloudId,
          issueId,
        });

        return comments.map((comment) => comment.id);
      },
    },
    expand: {
      label: "Expand",
      description: "Use [expand](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/#expansion) to include additional information about the issues in the response.",
      type: "string",
      optional: true,
    },
    visibilityType: {
      label: "Visibility Type",
      type: "string",
      description: "Whether visibility of this item is restricted to a group or role.",
      optional: true,
      options: actionConstants.VISIBILITY_TYPES,
    },
    visibilityValue: {
      label: "Visibility Value",
      description: "The name of the group or role to which visibility of this item is restricted.",
      type: "string",
      optional: true,
    },
    visibilityAdditionalProperties: {
      label: "Visibility Additional Properties",
      description: "Extra properties of any type may be provided to the visibility object.",
      type: "string",
      optional: true,
    },
    properties: {
      label: "Properties",
      description: "A list of comment properties.",
      type: "string[]",
      optional: true,
    },
    additionalProperties: {
      label: "Additional Properties",
      description: "Extra properties of any type may be provided to this object.",
      type: "string",
      optional: true,
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
    async getClouds() {
      return this._makeRequest("", {
        url: `${this._atlassianApiUrl()}/oauth/token/accessible-resources`,
      });
    },
    async getProjects({
      cloudId, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/project`, {}, $);
    },
    async getTransitions({
      cloudId, issueId, params, $,
    }) {
      const response = await this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/transitions`, {
        params,
      }, $);

      return response.transitions;
    },
    async getUsers({
      cloudId, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/users/search`, {}, $);
    },
    async getUser({
      cloudId, params, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/user`, {
        params,
      }, $);
    },
    async getIssues({
      cloudId, $,
    }) {
      const response = await this._makeRequest(`${cloudId}/rest/api/3/search`, {}, $);

      return response.issues;
    },
    async getIssue({
      cloudId, issueId, params, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}`, {
        params,
      }, $);
    },
    async getIssueComments({
      cloudId, issueId, params, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/comment`, {
        params,
      }, $);
    },
    async getTask({
      cloudId, taskId, params, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/task/${taskId}`, {
        params,
      }, $);
    },
    async createIssue({
      cloudId, params, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue`, {
        method: "post",
        params,
        data,
      }, $);
    },
    async updateIssue({
      cloudId, issueId, params, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}`, {
        method: "put",
        params,
        data,
      }, $);
    },
    async performTranstionIssue({
      cloudId, issueId, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/transitions`, {
        method: "post",
        data,
      }, $);
    },
    async createIssueAttachment({
      cloudId, issueId, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/attachments`, {
        method: "post",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          "X-Atlassian-Token": "no-check",
        },
        data,
      }, $);
    },
    async createIssueComment({
      cloudId, issueId, params, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/comment`, {
        method: "post",
        params,
        data,
      }, $);
    },
    async updateIssueComment({
      cloudId, issueId, commentId, params, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/issue/${issueId}/comment/${commentId}`, {
        method: "put",
        params,
        data,
      }, $);
    },
    async createVersion({
      cloudId, data, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/version`, {
        method: "post",
        data,
      }, $);
    },
    async deleteProject({
      cloudId, projectId, params, $,
    }) {
      return this._makeRequest(`${cloudId}/rest/api/3/project/${projectId}`, {
        method: "delete",
        params,
      }, $);
    },
  },
};
