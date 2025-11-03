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
      url, // Allow external URLs (e.g., presigned URLs)
      data,
      ...opts
    }) {
      const {
        headers: userHeaders,
        ...rest
      } = opts;

      // Use provided URL or construct from base URL + path
      const requestUrl = url || `${this._baseUrl()}${path}`;

      // For external URLs (like presigned URLs), don't add default headers
      // For internal API calls, add default headers
      const defaultHeaders = url
        ? {}
        : this._getHeaders();

      const config = {
        method,
        ...rest,
        url: requestUrl,
        headers: {
          ...defaultHeaders,
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
      const response = await this._makeRequest({
        $,
        url, // Use the presigned URL directly
        method: "POST",
        data: formData,
        headers: {
          ...formData.getHeaders(),
        },
      });
      return response;
    },
    async getUserInfo({ $ }) {
      const data = await this._makeRequest({
        $,
        method: "GET",
        path: "/me",
      });
      return data;
    },
    async getGenerationsByUserId({
      $, userId, offset = 0, limit = 20,
    }) {
      const data = await this._makeRequest({
        $,
        method: "GET",
        path: `/generations/user/${userId}`,
        params: {
          offset,
          limit,
        },
      });
      return data;
    },
  },
};
