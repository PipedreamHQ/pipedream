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
      async options(context) {
        const {
          workspaceId,
          repositoryId,
        } = context;
        const url = this._repositoryBranchesEndpoint(workspaceId, repositoryId);
        const params = {
          sort: "name",
          fields: [
            "next",
            "values.name",
          ],
        };

        const data = await this._propDefinitionsOptions(url, params, context);
        const options = data.values.map((branch) => ({
          label: branch.name,
          value: branch.name,
        }));
        return {
          options,
          context: {
            // https://developer.atlassian.com/bitbucket/api/2/reference/meta/pagination
            nextPageUrl: data.next,
          },
        };
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
      async options(context) {
        const { subjectType } = context;
        const url = this._eventTypesEndpoint(subjectType);
        const params = {
          fields: [
            "next",
            "values.category",
            "values.event",
            "values.label",
          ],
        };

        const data = await this._propDefinitionsOptions(url, params, context);
        const options = data.values.map(this._formatEventTypeOption);
        return {
          options,
          context: {
            // https://developer.atlassian.com/bitbucket/api/2/reference/meta/pagination
            nextPageUrl: data.next,
          },
        };
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
    async _createWebhook(data) {
      return await this._makeRequest("webhooks", {
        method: "post",
        data: {
          ...data,
          externalSubscriber: "PIPEDREAM",
        },
      });
    },
    async _removeWebhook(webhookId) {
      return await this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
    // _userWorkspacesEndpoint() {
    //   const baseUrl = this._apiUrl();
    //   return `${baseUrl}/workspaces`;
    // },
    // _workspaceRepositoriesEndpoint(workspaceId) {
    //   const baseUrl = this._apiUrl();
    //   return `${baseUrl}/repositories/${workspaceId}`;
    // },
    // _eventTypesEndpoint(subjectType) {
    //   const baseUrl = this._apiUrl();
    //   return `${baseUrl}/hook_events/${subjectType}`;
    // },
    // _repositoryBranchesEndpoint(workspaceId, repositoryId) {
    //   const baseUrl = this._apiUrl();
    //   return `${baseUrl}/repositories/${workspaceId}/${repositoryId}/refs`;
    // },
    // _branchCommitsEndpoint(workspaceId, repositoryId, branchName) {
    //   const baseUrl = this._apiUrl();
    //   return `${baseUrl}/repositories/${workspaceId}/${repositoryId}/commits/${branchName}`;
    // },
    // _hooksEndpointUrl(hookPathProps) {
    //   const {
    //     workspaceId,
    //     repositoryId,
    //   } = hookPathProps;
    //   return repositoryId ?
    //     this._repositoryHooksEndpointUrl(workspaceId, repositoryId) :
    //     this._workspaceHooksEndpointUrl(workspaceId);
    // },
    // _hookEndpointUrl(hookPathProps, hookId) {
    //   const {
    //     workspaceId,
    //     repositoryId,
    //   } = hookPathProps;
    //   return repositoryId ?
    //     this._repositoryHookEndpointUrl(workspaceId, repositoryId, hookId) :
    //     this._workspaceHookEndpointUrl(workspaceId, hookId);
    // },
    // _workspaceHooksEndpointUrl(workspaceId) {
    //   const baseUrl = this._userWorkspacesEndpoint();
    //   return `${baseUrl}/${workspaceId}/hooks`;
    // },
    // _workspaceHookEndpointUrl(workspaceId, hookId) {
    //   const baseUrl = this._workspaceHooksEndpointUrl(workspaceId);
    //   // https://developer.atlassian.com/bitbucket/api/2/reference/meta/uri-uuid#uuid
    //   return `${baseUrl}/{${hookId}}`;
    // },
    // _repositoryHooksEndpointUrl(workspaceId, repositoryId) {
    //   const baseUrl = this._workspaceRepositoriesEndpoint(workspaceId);
    //   return `${baseUrl}/${repositoryId}/hooks`;
    // },
    // _repositoryHookEndpointUrl(workspaceId, repositoryId, hookId) {
    //   const baseUrl = this._repositoryHooksEndpointUrl(workspaceId, repositoryId);
    //   // https://developer.atlassian.com/bitbucket/api/2/reference/meta/uri-uuid#uuid
    //   return `${baseUrl}/{${hookId}}`;
    // },
    // _formatEventTypeOption(eventType) {
    //   const {
    //     category,
    //     label,
    //     event,
    //   } = eventType;
    //   const optionLabel = `${category} ${label}`;
    //   return {
    //     label: optionLabel,
    //     value: event,
    //   };
    // },
    // async _propDefinitionsOptions(url, params, {
    //   page, prevContext,
    // }) {
    //   let requestConfig = this._makeRequestConfig();  // Basic axios request config
    //   if (page === 0) {
    //     // First time the options are being retrieved.
    //     //
    //     // In such case, we include the query parameters provided
    //     // as arguments to this function.
    //     //
    //     // For subsequent pages, the "next page" URL's (provided by
    //     // the BitBucket API) will already include these parameters,
    //     // so we don't need to explicitly provide them again.
    //     requestConfig = {
    //       ...requestConfig,
    //       params,
    //     };
    //   } else if (prevContext.nextPageUrl) {
    //     // Retrieve next page of options.
    //     url = prevContext.nextPageUrl;
    //   } else {
    //     // No more options available.
    //     return {
    //       values: [],
    //     };
    //   }

    //   const { data } = await axios.get(url, requestConfig);
    //   return data;
    // },
    // async *getCommits(opts) {
    //   const {
    //     workspaceId,
    //     repositoryId,
    //     branchName,
    //     lastProcessedCommitHash,
    //   } = opts;
    //   const requestConfig = this._makeRequestConfig();

    //   let url = this._branchCommitsEndpoint(workspaceId, repositoryId, branchName);
    //   do {
    //     const { data } = await axios.get(url, requestConfig);
    //     const {
    //       values,
    //       next,
    //     } = data;

    //     // Yield the retrieved commits in a serial manner, until
    //     // we exhaust the response from the BitBucket API, or we reach
    //     // the last processed commit, whichever comes first.
    //     for (const commit of values) {
    //       if (commit.hash === lastProcessedCommitHash) return;
    //       yield commit;
    //     }

    //     url = next;
    //   } while (url);
    // },
    // _authToken() {
    //   return this.$auth.oauth_access_token;
    // },
    // _makeRequestConfig() {
    //   const authToken = this._authToken();
    //   const headers = {
    //     "Authorization": `Bearer ${authToken}`,
    //     "User-Agent": "@PipedreamHQ/pipedream v0.1",
    //   };
    //   return {
    //     headers,
    //   };
    // },
    // async createHook(opts) {
    //   const {
    //     hookParams,
    //     hookPathProps,
    //   } = opts;
    //   const url = this._hooksEndpointUrl(hookPathProps);
    //   const requestConfig = this._makeRequestConfig();
    //   const response = await axios.post(url, hookParams, requestConfig);
    //   const hookId = response.data.uuid.match(/^{(.*)}$/)[1];
    //   return {
    //     hookId,
    //   };
    // },
    // async deleteHook(opts) {
    //   const {
    //     hookId,
    //     hookPathProps,
    //   } = opts;
    //   const url = this._hookEndpointUrl(hookPathProps, hookId);
    //   const requestConfig = this._makeRequestConfig();
    //   return axios.delete(url, requestConfig);
    // },

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
  },
};
