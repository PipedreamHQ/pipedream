import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gigasheet",
  propDefinitions: {
    handle: {
      type: "string",
      label: "Handle",
      description: "The handle of the dataset",
      async options() {
        const datasets = await this.getDatasets();
        return datasets.map(({
          FileName: label, FileUuid: value,
        }) => ({
          value,
          label: label ?? value,
        }));
      },
    },
    folderHandle: {
      type: "string",
      label: "Folder Handle",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gigasheet.com";
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
          "X-GIGASHEET-TOKEN": `${this.$auth.api_key}`,
        },
      });
    },
    async uploadDataFromUrl(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/upload/url",
      });
    },
    async createExport({
      handle, ...opts
    } = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: `/dataset/${handle}/export`,
      });
    },
    async downloadExport({
      handle, ...opts
    } = {}) {
      return this._makeRequest({
        ...opts,
        path: `/dataset/${handle}/download-export`,
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
