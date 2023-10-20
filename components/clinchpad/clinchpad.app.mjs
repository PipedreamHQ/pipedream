import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clinchpad",
  propDefinitions: {
    pipelineId: {
      label: "Pipeline ID",
      description: "The pipeline ID",
      type: "string",
      async options({ page }) {
        const pipelines = await this.getPipelines({
          params: {
            page: page + 1,
          },
        });

        return pipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline._id,
        }));
      },
    },
    userId: {
      label: "User ID",
      description: "The user ID",
      type: "string",
      async options({ page }) {
        const users = await this.getUsers({
          params: {
            page: page + 1,
          },
        });

        return users.map((user) => ({
          label: user.name,
          value: user._id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://www.clinchpad.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        auth: {
          username: "api-key",
          password: this._apiKey(),
        },
      });
    },
    async createLead(args = {}) {
      return this._makeRequest({
        path: "/leads",
        method: "post",
        ...args,
      });
    },
    async getPipelines(args = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...args,
      });
    },
    async getUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    async getLeads(args = {}) {
      return this._makeRequest({
        path: "/leads",
        ...args,
      });
    },
  },
};
