import { axios } from "@pipedream/platform";
import FormData from "form-data"

export default {
  type: "app",
  app: "leonardo_ai",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://cloud.leonardo.ai/api/rest/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
      });
    },
    async post({
      $ = this, path, data, ...opts
    }) {
      return this._makeRequest({
        $,
        path,
        method: "POST",
        data,
        ...opts,
      });
    },
    async get({
      $ = this, path, ...opts
    }) {
      return this._makeRequest({
        $,
        path,
        method: "GET",
        ...opts,
      });
    },
    async delete({
      $ = this, path, ...opts
    }) {
      return this._makeRequest({
        $,
        path,
        method: "DELETE",
        ...opts,
      });
    },
    async getPlatformModels({ $ }) {
      const data = await this.get({
        $,
        path: "/platformModels",
      });
      return data.custom_models || [];
    },
    async getUploadInitImage({ $, extension }) {
      const data = await this.post({
        $,
        path: "/init-image",
        data: {
          extension,
        },
      });
      return data;
    },
    async uploadFileToPresignedUrl({ $, url, fields, file }) {
      const formData = new FormData();

      // Add all the fields from the presigned URL response
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add the file - handle both File objects and File-like objects
      if (file.buffer) {
        // File-like object with buffer
        formData.append('file', file.buffer, {
          filename: file.name,
          contentType: file.type,
        });
      } else {
        // Regular File object
        formData.append('file', file);
      }

      const response = await axios($, {
        url,
        method: "POST",
        data: formData,
        headers: {
          ...formData.getHeaders(),
        },
      });

      return response;
    },
  },
};
