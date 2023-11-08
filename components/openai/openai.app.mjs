import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "openai",
  propDefinitions: {
    file_id: {
      type: "string",
      label: "File ID",
      description: "The ID of the file to use for this request.",
      async options({ prevContext }) {
        const files = await this.listFiles({
          purpose: prevContext
            ? prevContext.purpose
            : undefined,
        });
        return files.map((file) => ({
          label: file.filename,
          value: file.id,
        }));
      },
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The intended purpose of the file.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "The file content to be uploaded, represented as a string. The size of individual files can be a maximum of 512mb.",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.openai.com/v1";
    },
    _commonHeaders() {
      return {
        "Authorization": `Bearer ${this._apiKey()}`,
      };
    },
    async _makeRequest({
      $ = this,
      method = "GET",
      path,
      headers,
      data,
      params,
      ...otherOpts
    } = {}) {
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...this._commonHeaders(),
          ...headers,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async listFiles({ purpose } = {}) {
      return this._makeRequest({
        path: "/files",
        params: {
          purpose,
        },
      });
    },
    async uploadFile({
      file, purpose,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/files",
        data: {
          file: file.join("\n"),
          purpose,
        },
      });
    },
    async deleteFile({ file_id }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/files/${file_id}`,
      });
    },
    async retrieveFile({ file_id }) {
      return this._makeRequest({
        path: `/files/${file_id}`,
      });
    },
    async retrieveFileContent({ file_id }) {
      return this._makeRequest({
        path: `/files/${file_id}/content`,
      });
    },
  },
};
