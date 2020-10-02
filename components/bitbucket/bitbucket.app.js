const axios = require("axios");

module.exports = {
  type: "app",
  app: "bitbucket",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "The workspace that contains the repositories to work with.",
      async options(context) {
        const url = this._userWorkspacesEndpoint();
        const params = {
          sort: "name",
          fields: [
            "next",
            "values.name",
            "values.slug",
          ],
        };

        const data = await this._propDefinitionsOptions(url, params, context);
        const options = data.values.map(workspace => ({
          label: workspace.name,
          value: workspace.slug,
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
    repositoryId: {
      type: "string",
      label: "Repository",
      description: "The repository for which the events will be processed.",
      async options(context) {
        const { workspaceId } = context;
        const url = this._workspaceRepositoriesEndpoint(workspaceId);
        const params = {
          sort: "slug",
          fields: [
            "next",
            "values.slug",
          ],
        };

        const data = await this._propDefinitionsOptions(url, params, context);
        const options = data.values.map(repository => ({
          label: repository.slug,
          value: repository.slug,
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
    branchName: {
      type: "string",
      label: "Branch Name",
      description: "The name of the branch",
      async options(context) {
        const { workspaceId, repositoryId } = context;
        const url = this._repositoryBranchesEndpoint(workspaceId, repositoryId);
        const params = {
          sort: "name",
          fields: [
            "next",
            "values.name",
          ],
        };

        const data = await this._propDefinitionsOptions(url, params, context);
        const options = data.values.map(branch => ({
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
  },
  methods: {
    _apiUrl() {
      return "https://api.bitbucket.org/2.0";
    },
    _userWorkspacesEndpoint() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/workspaces`;
    },
    _workspaceRepositoriesEndpoint(workspaceId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/repositories/${workspaceId}`;
    },
    _repositoryBranchesEndpoint(workspaceId, repositoryId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/repositories/${workspaceId}/${repositoryId}/refs`;
    },
    _branchCommitsEndpoint(workspaceId, repositoryId, branchName) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/repositories/${workspaceId}/${repositoryId}/commits/${branchName}`;
    },
    _hooksEndpointUrl(workspaceId, repositoryId) {
      const baseUrl = this._workspaceRepositoriesEndpoint(workspaceId);
      return `${baseUrl}/${repositoryId}/hooks`;
    },
    _hookEndpointUrl(workspaceId, repositoryId, hookId) {
      const baseUrl = this._hooksEndpointUrl(workspaceId, repositoryId);
      // https://developer.atlassian.com/bitbucket/api/2/reference/meta/uri-uuid#uuid
      return `${baseUrl}/{${hookId}}`;
    },
    async _propDefinitionsOptions(url, params, { page, prevContext }) {
      let requestConfig = this._makeRequestConfig();  // Basic axios request config
      if (page === 0) {
        // First time the options are being retrieved.
        // Include the parameters provided, which will be persisted
        // across the different pages.
        requestConfig = {
          ...requestConfig,
          params,
        };
      } else if (prevContext.nextPageUrl) {
        // Retrieve next page of options.
        url = prevContext.nextPageUrl;
      } else {
        // No more options available.
        return { values: [] };
      }

      const { data } = await axios.get(url, requestConfig);
      return data;
    },
    async *getCommits(opts) {
      const {
        workspaceId,
        repositoryId,
        branchName,
        lastProcessedCommitHash,
      } = opts;
      const requestConfig = this._makeRequestConfig();

      let url = this._branchCommitsEndpoint(workspaceId, repositoryId, branchName);
      do {
        const { data } = await axios.get(url, requestConfig);
        const { values, next } = data;

        // Yield the retrieved commits in a serial manner, until
        // we exhaust the response from the BitBucket API, or we reach
        // the last processed commit, whichever comes first.
        for (const commit of values) {
          if (commit.hash === lastProcessedCommitHash) return;
          yield commit;
        }

        url = next;
      } while (url);
    },
    _authToken() {
      return this.$auth.oauth_access_token
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async createHook(opts) {
      const {
        workspaceId,
        repositoryId,
        hookParams,
      } = opts;
      const url = this._hooksEndpointUrl(workspaceId, repositoryId);
      const requestConfig = this._makeRequestConfig();

      const response = await axios.post(url, hookParams, requestConfig);
      const hookId = response.data.uuid.match(/^{(.*)}$/)[1];
      return {
        hookId,
      };
    },
    deleteHook(opts) {
      const {
        workspaceId,
        repositoryId,
        hookId,
      } = opts;
      const url = this._hookEndpointUrl(workspaceId, repositoryId, hookId);
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
    isValidSource(headers, db) {
      const hookId = headers["x-hook-uuid"];
      const expectedHookId = db.get("hookId");
      return hookId === expectedHookId;
    },
  },
};
