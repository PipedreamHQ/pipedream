import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gigasheet",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the data to upload",
    },
    datasetHandle: {
      type: "string",
      label: "Dataset Handle",
      description: "The handle of the dataset",
      async options() {
        const { datasets } = await this.getDatasets();
        return datasets.map((e) => ({
          value: e.handle,
          label: e.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gigasheet.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
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
          "X-GIGASHEET-TOKEN": `${this.$auth.api_key}`,
        },
      });
    },
    async uploadDataFromUrl(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/upload/url",
        data: {
          url: opts.url,
        },
      });
    },
    async createExport(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/dataset/${opts.datasetHandle}/export`,
      });
    },
    async downloadExport(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "GET",
        path: `/dataset/${opts.datasetHandle}/download/export`,
      });
    },
    async getDatasets(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/datasets",
      });
    },
  },
};
