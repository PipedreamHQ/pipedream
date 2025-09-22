import { axios } from "@pipedream/platform";

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
      $ = this,
      method = "GET",
      path,
      data,
      ...opts
    }) {
      const {
        headers: userHeaders,
        ...rest
      } = opts;
      const config = {
        method,
        ...rest,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._getHeaders(),
          ...(userHeaders || {}),
        },
        data,
      };
      return await axios($, config);
    },
    async getPlatformModels() {
      const data = await this._makeRequest({
        method: "GET",
        path: "/platformModels",
      });
      return data.custom_models || [];
    },
    async getUploadInitImage({
      $, extension,
    }) {
      const data = await this._makeRequest({
        $,
        method: "POST",
        path: "/init-image",
        data: {
          extension,
        },
      });
      return data;
    },
    async uploadFileToPresignedUrl({
      $, url, formData,
    }) {
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
