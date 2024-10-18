import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fluxguard",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the Fluxguard project.",
      async options() {
        const projects = await this.listProjects();
        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    checkId: {
      type: "string",
      label: "Check ID",
      description: "The ID of the check within the project.",
      async options({ projectId }) {
        const checks = await this.listChecks({
          projectId,
        });
        return checks.map((check) => ({
          label: check.name,
          value: check.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.fluxguard.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/account/webhook",
        method: "put",
        ...args,
      });
    },
    async removeWebhook({ ...args }) {
      return this._makeRequest({
        path: "/account/webhook",
        method: "delete",
        ...args,
      });
    },
  },
};
