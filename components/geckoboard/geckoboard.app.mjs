import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "geckoboard",
  propDefinitions: {
    fields: {
      type: "string",
      label: "Fields",
      description: "JSON containing the fields of the dataset, i.e.: `{ \"amount\": { \"type\": \"number\", \"name\": \"Amount\", \"optional\": false }, \"timestamp\": { \"type\": \"datetime\", \"name\": \"Date\" } }`. See [documentation](https://developer.geckoboard.com/#plan-your-schema)",
    },
    id: {
      type: "string",
      label: "ID",
      description: "The ID of the dataset that will be created",
    },
    datasetId: {
      type: "string",
      label: "Dataset Id",
      description: "The ID of the dataset",
      async options() {
        const response = await this.getDatasets();
        const datasets = response.data;
        return datasets.map(({ id }) => ({
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.geckoboard.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers = {},
        ...otherOpts
      } = opts;

      const token = Buffer
        .from(`${this.$auth.api_key}:`)
        .toString("base64");

      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },
    async appendToDataset({
      datasetId, ...args
    }) {
      return this._makeRequest({
        path: `/datasets/${datasetId}/data`,
        method: "post",
        ...args,
      });
    },
    async createDataset({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/datasets/${id}`,
        method: "put",
        ...args,
      });
    },
    async deleteDataset({
      datasetId, ...args
    }) {
      return this._makeRequest({
        path: `/datasets/${datasetId}`,
        method: "delete",
        ...args,
      });
    },
    async getDatasets(args = {}) {
      return this._makeRequest({
        path: "/datasets",
        ...args,
      });
    },
  },
};
