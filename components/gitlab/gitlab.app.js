const axios = require("axios");
const uuid = require("uuid");

module.exports = {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
    },
  },
  methods: {
    apiUrl() {
      return "https://gitlab.com/api/v4";
    },
    gitlabAuthToken() {
      return this.$auth.oauth_access_token
    },
    generateToken: uuid.v4,
    isValidSource(headers, db) {
      const token = headers["x-gitlab-token"];
      const expectedToken = db.get("token");
      return token === expectedToken;
    },
    async createHook(opts) {
      const { projectId, hookParams } = opts;
      const baseUrl = this.apiUrl();
      const url = `${baseUrl}/projects/${projectId}/hooks`;

      const token = this.generateToken();
      const data = {
        ...hookParams,
        token,
      };

      const gitlabAuthToken = this.gitlabAuthToken();
      const headers = {
        "Authorization": `Bearer ${gitlabAuthToken}`,
      };

      const requestParams = {
        headers,
      };
      const response = await axios.post(url, data, requestParams);
      const hookId = response.data.id;
      return {
        hookId,
        token,
      };
    },
    deleteHook(opts) {
      const { hookId, projectId } = opts;
      const baseUrl = this.apiUrl();
      const url = `${baseUrl}/projects/${projectId}/hooks/${hookId}`;

      const gitlabAuthToken = this.gitlabAuthToken();
      const headers = {
        "Authorization": `Bearer ${gitlabAuthToken}`,
      };

      const requestParams = {
        headers,
      };
      return axios.delete(url, requestParams);
    },
  },
};
