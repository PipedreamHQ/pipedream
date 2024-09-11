import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "akkio",
  propDefinitions: {
    data: {
      type: "string[]",
      label: "Data",
      description: "Data in the format of: [{'field name 1': 'value 1', 'field name 2': 0}, {...}, ...]",
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model to make the prediction with",
      async options() {
        const models = await this.getAllModels();
        return models.map((model) => ({
          label: model.name,
          value: model.id,
        }));
      },
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.akkio.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getAllModels(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: "/models",
      });
    },
    async makePrediction({
      data, modelId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/models",
        data: {
          api_key: this.$auth.api_key,
          data: data.map(JSON.parse),
          id: modelId,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
