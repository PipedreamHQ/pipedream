import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "filepost",
  propDefinitions: {
    fileId: {
      type: "string",
      label: "File ID",
      description: "The unique ID of the uploaded file (the `file_id` field returned by the Upload File action). Obtain this from **List Files**",
      async options({ page }) {
        const { files } = await this.listFiles({
          params: {
            page: page + 1,
          },
        });
        return files?.map(({
          file_id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "A file path in `/tmp` (e.g. `/tmp/image.png`) or a public URL to upload to FilePost CDN.",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://filepost.dev/v1";
    },
    async _makeRequest({
      $ = this, headers, ...opts
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "X-API-Key": this._apiKey(),
        },
        ...opts,
      });
    },
    async uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/upload",
        ...opts,
      });
    },
    async listFiles(opts = {}) {
      return this._makeRequest({
        url: "/files",
        ...opts,
      });
    },
    async getFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        url: `/files/${fileId}`,
        ...opts,
      });
    },
    async deleteFile({
      fileId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/files/${fileId}`,
        ...opts,
      });
    },
  },
};
