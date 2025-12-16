import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "upsales",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "Select a user or provide a user ID",
      async options() {
        const data = await this.listUsers();
        return data.map((user) => ({
          label: `${user.name} (${user.email})`,
          value: user.clientid,
        }));
      },
    },
    stageId: {
      type: "string",
      label: "Stage ID",
      description: "Select a stage or provide a stage ID",
      async options() {
        const data = await this.listStages();
        return data.map((stage) => ({
          label: `${stage.name} (${stage.probability}%)`,
          value: stage.id,
        }));
      },
    },
    stageName: {
      type: "string",
      label: "Name",
      description: "The name of the stage",
    },
    stageProbability: {
      type: "integer",
      label: "Probability",
      description: "The probability percentage (0-100) associated with this stage",
      min: 0,
      max: 100,
    },
  },
  methods: {
    _baseUrl() {
      return "https://integration.upsales.com/api/v2";
    },
    async _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        params: {
          token: this.$auth.api_key,
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/master/users",
        ...args,
      });
    },
    async listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
    async getUser({
      userId, ...args
    }) {
      return this._makeRequest({
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async deactivateUser({
      userId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/master/users/${userId}`,
        ...args,
      });
    },
    async listStages(args = {}) {
      return this._makeRequest({
        url: "/orderstages",
        ...args,
      });
    },
    async getStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
    async createStage(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/orderstages",
        ...args,
      });
    },
    async updateStage({
      stageId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/orderstages/${stageId}`,
        ...args,
      });
    },
  },
};
