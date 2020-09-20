const axios = require("axios");
const parseLinkHeader = require('parse-link-header');
const uuid = require("uuid");

module.exports = {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
      description: "The project ID, as displayed in the main project page",
      async options(context) {
        const url = this._userProjectsEndpoint();
        const params = {
          order_by: "path",
          sort: "asc",
        };

        const { data, next } = await this._propDefinitionsOptions(url, params, context);

        const options = data.map(project => ({
          label: project.path_with_namespace,
          value: project.id,
        }));
        return {
          options,
          context: {
            nextPage: next,
          },
        };
      },
    },
    branchName: {
      type: "string",
      label: "Branch Name",
      description: "The name of the branch",
      async options(context) {
        const { projectId } = context;
        const url = this._projectBranchesEndpoint(projectId);
        const params = {
          order_by: "name",
        };

        const { data, next } = await this._propDefinitionsOptions(url, params, context);

        const options = data.map(branch => branch.name);
        return {
          options,
          context: {
            nextPage: next,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://gitlab.com/api/v4";
    },
    _userProjectsEndpoint() {
      const baseUrl = this._apiUrl();
      const userId = this._gitlabUserId();
      return `${baseUrl}/users/${userId}/projects`;
    },
    _projectBranchesEndpoint(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/repository/branches`;
    },
    _projectCommitsEndpoint(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/repository/commits`;
    },
    _projectMilestonesEndpoint(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/milestones`;
    },
    _hooksEndpointUrl(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/hooks`;
    },
    _gitlabAuthToken() {
      return this.$auth.oauth_access_token
    },
    _gitlabUserId() {
      return this.$auth.oauth_uid;
    },
    _makeRequestConfig() {
      const gitlabAuthToken = this._gitlabAuthToken();
      const headers = {
        "Authorization": `Bearer ${gitlabAuthToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _generateToken: uuid.v4,
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
      } else if (prevContext.nextPage) {
        // Retrieve next page of options.
        url = prevContext.nextPage.url;
      } else {
        // No more options available.
        return { data: [] };
      }

      const { data, headers } = await axios.get(url, requestConfig);
      // https://docs.gitlab.com/ee/api/README.html#pagination-link-header
      const { next } = parseLinkHeader(headers.link);

      return {
        data,
        next,
      };
    },
    isValidSource(headers, db) {
      const token = headers["x-gitlab-token"];
      const expectedToken = db.get("token");
      return token === expectedToken;
    },
    async *getCommits(opts) {
      const { projectId, branchName } = opts;

      // Nothing to do here if the amount of commits we wish
      // to retrieve is not greater than 0.
      let { totalCommitsCount } = opts;
      if (totalCommitsCount <= 0) return;

      let url = this._projectCommitsEndpoint(projectId);
      const baseRequestConfig = this._makeRequestConfig();

      do {
        // Prepare the parameters for the Gitlab API call.
        const resultsPerPage = Math.min(50, totalCommitsCount);
        const params = {
          ref_name: branchName,
          per_page: resultsPerPage,
        };
        const requestConfig = {
          ...baseRequestConfig,
          params,
        };

        // Yield the retrieved commits in a serial manner, until
        // we exhaust the response from the Gitlab API, or we reach
        // the total amount of commits that are relevant for this case,
        // whichever comes first.
        const { data, headers } = await axios.get(url, requestConfig);
        for (const commit of data) {
          yield commit;
          --totalCommitsCount;
          if (totalCommitsCount === 0) return;
        }

        // Extract the URL of the next page, if any.
        const { next } = parseLinkHeader(headers.link);
        url = next ? next.url : null;
      } while (url);
    },
    async *getMilestones(opts) {
      const {
        projectId,
        lastProcessedMilestoneId = -1,
        pageSize = 10,
      } = opts;

      let url = this._projectMilestonesEndpoint(projectId);

      // Prepare the parameters for the Gitlab API call.
      const baseRequestConfig = this._makeRequestConfig();
      const params = {
        per_page: pageSize,
      };
      const requestConfig = {
        ...baseRequestConfig,
        params,
      };

      do {
        // Yield the retrieved milestones in a serial manner, until
        // we exhaust the response from the Gitlab API, or we reach
        // the last processed milestone from the previous run,
        // whichever comes first.
        const { data, headers } = await axios.get(url, requestConfig);
        for (const milestone of data) {
          if (milestone.id === lastProcessedMilestoneId) return;
          yield milestone;
        }

        // Extract the URL of the next page, if any.
        const { next } = parseLinkHeader(headers.link);
        url = next ? next.url : null;
      } while (url);
    },
    async createHook(opts) {
      const { projectId, hookParams } = opts;
      const url = this._hooksEndpointUrl(projectId);

      const token = this._generateToken();
      const data = {
        ...hookParams,
        token,
      };

      const requestConfig = this._makeRequestConfig();
      const response = await axios.post(url, data, requestConfig);
      const hookId = response.data.id;
      return {
        hookId,
        token,
      };
    },
    deleteHook(opts) {
      const { hookId, projectId } = opts;
      const baseUrl = this._hooksEndpointUrl(projectId);
      const url = `${baseUrl}/${hookId}`;
      const requestConfig = this._makeRequestConfig();
      return axios.delete(url, requestConfig);
    },
  },
};
