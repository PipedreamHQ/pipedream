const axios = require("axios");
const uuid = require("uuid");

module.exports = {
  type: "app",
  app: "gitlab",
  propDefinitions: {
    repoId: {
      type: "string",
      label: "Repo ID",
    },
  },
  methods: {
    apiUrl() {
      return "https://gitlab.com/api/v4";
    },
    gitlabAuthToken() {
      return this.$auth.oauth_access_token
    },
    generateSecret: uuid.v4,
    async createHook(opts) {
      const { repoId, hookParams } = opts;
      const baseUrl = this.apiUrl();
      const url = `${baseUrl}/projects/${repoId}/hooks`;

      const token = this.generateSecret();
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
      const { hookId, repoId } = opts;
      const baseUrl = this.apiUrl();
      const url = `${baseUrl}/projects/${repoId}/hooks/${hookId}`;

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
