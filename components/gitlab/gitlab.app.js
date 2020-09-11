const axios = require("axios");
const uuid = require("uuid");

module.exports = {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    projectId: {
      type: "integer",
      label: "Project ID",
    },
  },
  methods: {
    _apiUrl() {
      return "https://gitlab.com/api/v4";
    },
    _endpointUrl(projectId) {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/projects/${projectId}/hooks`;
    },
    _gitlabAuthToken() {
      return this.$auth.oauth_access_token
    },
    _makeRequestParams() {
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
    isValidSource(headers, db) {
      const token = headers["x-gitlab-token"];
      const expectedToken = db.get("token");
      return token === expectedToken;
    },
    async createHook(opts) {
      const { projectId, hookParams } = opts;
      const url = this._endpointUrl(projectId);

      const token = this._generateToken();
      const data = {
        ...hookParams,
        token,
      };

      const requestParams = this._makeRequestParams();
      const response = await axios.post(url, data, requestParams);
      const hookId = response.data.id;
      return {
        hookId,
        token,
      };
    },
    deleteHook(opts) {
      const { hookId, projectId } = opts;
      const baseUrl = this._endpointUrl(projectId);
      const url = `${baseUrl}/${hookId}`;
      const requestParams = this._makeRequestParams();
      return axios.delete(url, requestParams);
    },
  },
};
