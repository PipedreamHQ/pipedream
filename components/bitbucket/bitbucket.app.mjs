import { axios } from "@pipedream/platform";
import defaultAxios from "axios";
import constants from "./sources/common/constants.mjs";

export default {
  type: "app",
  app: "bitbucket",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "Select a workspace",
      async options({ page }) {
        const workspaces = await this.getWorkspaces({
          params: {
            page: page + 1,
          },
        });

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.slug,
        }));
      },
    },
    repository: {
      type: "string",
      label: "Repository",
      description: "Select a repository",
      async options({
        workspaceId, page,
      }) {
        const repositories = await this.getRepositories({
          workspaceId,
          params: {
            page: page + 1,
          },
        });
        return repositories.map((repository) => ({
          label: repository.name,
          value: repository.uuid,
        }));
      },
    },
    branch: {
      type: "string",
      label: "Branch Name",
      description: "Select a branch",
      async options({
        workspaceId, repositoryId, page,
      }) {
        const branches = await this.getBranches({
          workspaceId,
          repositoryId,
          params: {
            page: page + 1,
          },
        });

        return branches.map((branch) => branch.name);
      },
    },
    issue: {
      type: "string",
      label: "Issue",
      description: "Select a issue",
      async options({
        workspaceId, repositoryId, page,
      }) {
        const issues = await this.getIssues({
          workspaceId,
          repositoryId,
          params: {
            page: page + 1,
          },
        });

        return issues.map((issue) => ({
          label: issue.title,
          value: issue.id,
        }));
      },
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Select a comment",
      async options({
        workspaceId, repositoryId, issueId, page,
      }) {
        const comments = await this.getIssueComments({
          workspaceId,
          repositoryId,
          issueId,
          params: {
            page: page + 1,
          },
        });

        return comments.map((comment) => ({
          label: comment.content.raw ?? comment.content.html ?? comment.content.markup,
          value: comment.id,
        }));
      },
    },
    snippet: {
      type: "string",
      label: "Snippet",
      description: "Select a snippet",
      async options({
        workspaceId, page,
      }) {
        const snippets = await this.getWorkspaceSnippets({
          workspaceId,
          params: {
            page: page + 1,
          },
        });

        return snippets.map((snippet) => ({
          label: snippet.title,
          value: snippet.id,
        }));
      },
    },
    user: {
      type: "string",
      label: "Users",
      description: "Select a user",
      async options({
        workspaceId, page,
      }) {
        const members = await this.getWorkspaceMembers({
          workspaceId,
          params: {
            page: page + 1,
          },
        });

        return members.map((member) => ({
          label: member.user.nickname,
          value: member.user.uuid,
        }));
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to watch",
      async options({ subjectType }) {
        const eventTypes = await this.getEventTypes({
          subjectType,
        });

        return eventTypes.map((eventType) => ({
          label: eventType.description,
          value: eventType.event,
        }));
      },
    },
    multiRepositories: {
      type: "string[]",
      label: "Repository",
      description: "Select repositories",
      async options({
        workspaceId, page,
      }) {
        const repositories = await this.getRepositories({
          workspaceId,
          params: {
            page: page + 1,
          },
        });

        return repositories.map((repository) => ({
          label: repository.name,
          value: repository.uuid,
        }));
      },
    },
    rawContent: {
      label: "Raw Content",
      description: "The raw content",
      type: "string",
      optional: true,
    },
    htmlContent: {
      label: "HTML Content",
      description: "The html content",
      type: "string",
      optional: true,
    },
    markupContent: {
      label: "Markup Content",
      description: "The markup content",
      type: "string",
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.bitbucket.org/2.0";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createWebhook({
      path, workspaceId, url, events,
    }) {
      return await this._makeRequest(path, {
        method: "post",
        data: {
          description: `Webhook ${workspaceId} ${events}`,
          url,
          events,
          active: true,
        },
      });
    },
    async removeWebhook({
      path, webhookId,
    }) {
      return await this._makeRequest(`${path}/${webhookId}`, {
        method: "delete",
      });
    },
    async getWorkspaceSnippets({
      workspaceId, params,
    }, $) {
      const response = await this._makeRequest(`snippets/${workspaceId}`, {
        params,
      }, $);

      return response.values;
    },
    async getSnippet({
      workspaceId, snippetId,
    }, $) {
      return await this._makeRequest(`snippets/${workspaceId}/${snippetId}`, {}, $);
    },
    async createSnippetComment({
      workspaceId, snippetId, data,
    }, $) {
      const response = await this._makeRequest(`snippets/${workspaceId}/${snippetId}/comments`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async getIssues({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues`, {
        params,
      }, $);

      return response.values;
    },
    async getIssue({
      workspaceId, repositoryId, issueId,
    }, $) {
      return await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}`, {}, $);
    },
    async createIssue({
      workspaceId, repositoryId, data,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async getIssueComments({
      workspaceId, repositoryId, issueId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments`, {
        params,
      }, $);

      return response.values;
    },
    async createIssueComment({
      workspaceId, repositoryId, issueId, data,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async updateIssueComment({
      workspaceId, repositoryId, issueId, commentId, data,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments/${commentId}`, {
        method: "put",
        data,
      }, $);

      return response.values;
    },
    async getWorkspaceMembers({
      workspaceId, params,
    }, $) {
      const response = await this._makeRequest(`workspaces/${workspaceId}/members`, {
        params,
      }, $);

      return response.values;
    },
    async getWorkspaces({ params }, $) {
      const response = await this._makeRequest("workspaces", {
        params,
      }, $);

      return response.values;
    },
    async getRepositories({
      workspaceId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}`, {
        params,
      }, $);

      return response.values;
    },
    async getRepositoryFiles({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/downloads/`, {
        params,
      }, $);

      return response.values;
    },
    async getRepositoryFile({
      workspaceId, repositoryId, filename,
    }) {
      // We are using Default Axios here because of a bug in @pipedream/platform axios
      // lib, in the future need refact this

      return defaultAxios({
        url: `${this._apiUrl()}/repositories/${workspaceId}/${repositoryId}/downloads/${filename}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
      });
    },
    async getEventTypes({ subjectType }, $) {
      const response = await this._makeRequest(`hook_events/${subjectType}`, {}, $);

      return response.values;
    },
    async getBranches({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/refs/branches`, {
        params,
      }, $);

      return response.values;
    },
    async getCommits({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/commits`, {
        params,
      }, $);

      return response.values;
    },
    async getCommitComments({
      workspaceId, repositoryId, commitId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/commit/${commitId}/comments`, {
        params,
      }, $);

      return response.values;
    },
    async loadBranchHistoricalData(workspaceId, repositoryId) {
      const branches = await this.getBranches({
        workspaceId,
        repositoryId,
        params: {
          page: 1,
          pagelen: constants.HISTORICAL_DATA_LENGTH,
        },
      });
      const ts = new Date().getTime();
      return branches.map((branch) => ({
        main: branch.name,
        sub: {
          id: `${branch.name}-${ts}`,
          summary: `New branch ${branch.name} created`,
          ts,
        },
      }));
    },
    async getPullRequests({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/pullrequests`, {
        params,
      }, $);

      return response.values;
    },
    async getPullRequestActivities({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/pullrequests/activity`, {
        params,
      }, $);
      return response.values;
    },
    async getTags({
      workspaceId, repositoryId, params,
    }, $) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/refs/tags`, {
        params,
      }, $);

      return response.values;
    },

  },
};
