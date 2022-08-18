import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "streak",
  propDefinitions: {
    pipelineId: {
      type: "string",
      label: "Pipeline",
      description: "Filter by pipeline",
      async options() {
        const pipelines = await this.listPipelines();
        return pipelines.map((pipeline) => ({
          label: pipeline.name,
          value: pipeline.key,
        }));
      },
    },
    teamId: {
      type: "string",
      label: "Team",
      description: "Filter by team",
      async options() {
        const { results } = await this.listTeams();
        return results.map((team) => ({
          label: team.name,
          value: team.key,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.streak.com/api/";
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "v2/webhooks",
        ...args,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `v2/webhooks/${id}`,
      });
    },
    async listPipelines(args = {}) {
      return this._makeRequest({
        path: "v1/pipelines",
        ...args,
      });
    },
    async listTeams(args = {}) {
      return this._makeRequest({
        path: "v2/users/me/teams",
        ...args,
      });
    },
    async listBoxes({
      pipelineId, ...args
    }) {
      return this._makeRequest({
        path: `v1/pipelines/${pipelineId}/boxes`,
        ...args,
      });
    },
    async listComments({
      boxId, ...args
    }) {
      return this._makeRequest({
        path: `v2/boxes/${boxId}/comments`,
        ...args,
      });
    },
    async listContacts({
      teamId, ...args
    }) {
      const { members } = await this._makeRequest({
        path: `v2/teams/${teamId}`,
        ...args,
      });
      return members;
    },
  },
};
