import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postman",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection to run",
      async options() {
        const collections = await this.listCollections();
        return collections.map((collection) => ({
          label: collection.name,
          value: collection.id,
        }));
      },
    },
    environmentId: {
      type: "string",
      label: "Environment ID",
      description: "The ID of the environment to be used",
      async options() {
        const environments = await this.listEnvironments();
        return environments.map((environment) => ({
          label: environment.name,
          value: environment.id,
        }));
      },
    },
    environmentVariableKey: {
      type: "string",
      label: "Environment Variable Key",
      description: "The key of the environment variable to update",
    },
    environmentVariableValue: {
      type: "string",
      label: "Environment Variable Value",
      description: "The new value for the environment variable",
    },
    newEnvironmentName: {
      type: "string",
      label: "New Environment Name",
      description: "The name for the new environment",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getpostman.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Api-Key": `${this.$auth.api_key}`,
          "Accept": "application/vnd.api.v10+json",
        },
      });
    },
    async listCollections() {
      const response = await this._makeRequest({
        path: "/collections",
      });
      return response.collections;
    },
    async listEnvironments() {
      const response = await this._makeRequest({
        path: "/environments",
      });
      return response.environments;
    },
    async createEnvironment(name) {
      return this._makeRequest({
        method: "POST",
        path: "/environments",
        data: {
          name,
        },
      });
    },
    async updateEnvironmentVariable(environmentId, key, value) {
      return this._makeRequest({
        method: "PUT",
        path: `/environments/${environmentId}`,
        data: {
          values: [
            {
              key,
              value,
            },
          ],
        },
      });
    },
    async runCollection(collectionId, environmentId) {
      return this._makeRequest({
        method: "POST",
        path: `/collections/${collectionId}/run`,
        data: {
          environment_id: environmentId,
        },
      });
    },
  },
};
