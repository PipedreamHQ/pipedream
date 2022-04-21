import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bitbucket",
  propDefinitions: {
    workspaces: {
      type: "string",
      label: "Workspace",
      description: "Select a workspace",
      async options() {
        const workspaces = await this.getWorkspaces();

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.slug,
        }));
      },
    },
    repositories: {
      type: "string",
      label: "Repository",
      description: "Select a repository",
      async options({
        workspaceId, page,
      }) {
        const repositories = await this.getRepositories({
          workspaceId,
          params: {
            page: page + 1 ?? 1,
          },
        });

        return repositories.map((repository) => ({
          label: repository.name,
          value: repository.uuid,
        }));
      },
    },
    branchs: {
      type: "string",
      label: "Branch Name",
      description: "Select a branch",
      async options({
        workspaceId, repositoryId, page,
      }) {
        const branchs = await this.getBranchs({
          workspaceId,
          repositoryId,
          params: {
            page: page + 1 ?? 1,
          },
        });

        return branchs.map((branch) => branch.name);
      },
    },
    issues: {
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
            page: page + 1 ?? 1,
          },
        });

        return issues.map((issue) => ({
          label: issue.title,
          value: issue.id,
        }));
      },
    },
    comments: {
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
            page: page + 1 ?? 1,
          },
        });

        return comments.map((comment) => ({
          label: comment.content.raw ?? comment.content.html ?? comment.content.markup,
          value: comment.id,
        }));
      },
    },
    snippets: {
      type: "string",
      label: "Snippet",
      description: "Select a snippet",
      async options({
        workspaceId, page,
      }) {
        const snippets = await this.getWorkspaceSnippets({
          workspaceId,
          params: {
            page: page + 1 ?? 1,
          },
        });

        return snippets.map((snippet) => ({
          label: snippet.title,
          value: snippet.id,
        }));
      },
    },
    users: {
      type: "string",
      label: "Users",
      description: "Select a user",
      async options({
        workspaceId, page,
      }) {
        const members = await this.getWorkspaceMembers({
          workspaceId,
          params: {
            page: page + 1 ?? 1,
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
    async _makeRequest(path, options = {}, $ = undefined) {
      return await axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async _createWebhook({
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
    async _removeWebhook({
      path, webhookId,
    }) {
      return await this._makeRequest(`${path}/${webhookId}`, {
        method: "delete",
      });
    },
    async getWorkspaceSnippets({
      workspaceId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`snippets/${workspaceId}`, {
        params,
      }, $);

      return response.values;
    },
    async getSnippet({
      workspaceId, snippetId,
    }, $ = undefined) {
      return await this._makeRequest(`snippets/${workspaceId}/${snippetId}`, {}, $);
    },
    async createSnippetComment({
      workspaceId, snippetId, data,
    }, $ = undefined) {
      const response = await this._makeRequest(`snippets/${workspaceId}/${snippetId}/comments`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async getIssues({
      workspaceId, repositoryId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues`, {
        params,
      }, $);

      return response.values;
    },
    async getIssue({
      workspaceId, repositoryId, issueId,
    }, $ = undefined) {
      return await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}`, {}, $);
    },
    async createIssue({
      workspaceId, repositoryId, data,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async getIssueComments({
      workspaceId, repositoryId, issueId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments`, {
        params,
      }, $);

      return response.values;
    },
    async createIssueComment({
      workspaceId, repositoryId, issueId, data,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments`, {
        method: "post",
        data,
      }, $);

      return response.values;
    },
    async updateIssueComment({
      workspaceId, repositoryId, issueId, commentId, data,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/issues/${issueId}/comments/${commentId}`, {
        method: "put",
        data,
      }, $);

      return response.values;
    },
    async getWorkspaceMembers({
      workspaceId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`workspaces/${workspaceId}/members`, {
        params,
      }, $);

      return response.values;
    },
    async getWorkspaces($ = undefined) {
      const response = await this._makeRequest("workspaces", {}, $);

      return response.values;
    },
    async getRepositories({
      workspaceId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}`, {
        params,
      }, $);

      return response.values;
    },
    async getRepositoryFiles({
      workspaceId, repositoryId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/downloads/`, {
        params,
      }, $);

      return response.values;
    },
    async getRepositoryFile({
      workspaceId, repositoryId, filename,
    }, $ = undefined) {
      return await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/downloads/${filename}`, {}, $);
    },
    async getBranchs({
      workspaceId, repositoryId, params,
    }, $ = undefined) {
      const response = await this._makeRequest(`repositories/${workspaceId}/${repositoryId}/refs/branches`, {
        params,
      }, $);

      return response.values;
    },
    async getEventTypes({ subjectType }, $ = undefined) {
      const response = await this._makeRequest(`hook_events/${subjectType}`, {}, $);

      return response.values;
    },
  },
};
