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
          // sort: "asc",
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
