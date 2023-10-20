import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "phrase",
  propDefinitions: {
    projectId: {
      label: "Project ID",
      description: "The project ID",
      type: "string",
      async options() {
        const projects = await this.getProjects();

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.access_token;
    },
    _apiUrl() {
      return "https://api.phrase.com/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `token ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/webhooks`,
        method: "post",
        ...args,
      });
    },
    async removeWebhook({
      projectId, webhookId,
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/webhooks/${webhookId}`,
        method: "delete",
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async getJobs({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/jobs`,
        ...args,
      });
    },
  },
};
