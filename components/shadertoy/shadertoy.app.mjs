import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "shadertoy",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The search query string to find shaders",
    },
    shaderId: {
      type: "string",
      label: "Shader ID",
      description: "The unique identifier of the shader",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.shadertoy.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    },
    async queryShaders({ query }) {
      const params = {
        key: this.$auth.api_key,
        query: encodeURIComponent(query),
      };
      return this._makeRequest({
        path: `/shaders/query/${encodeURIComponent(query)}`,
        params,
      });
    },
    async getShaderById({ shaderId }) {
      return this._makeRequest({
        path: `/shaders/${encodeURIComponent(shaderId)}`,
        params: {
          key: this.$auth.api_key,
        },
      });
    },
    async getShaderAsset({
      shaderId, assetPath,
    }) {
      return this._makeRequest({
        path: `/shaders/${encodeURIComponent(shaderId)}/${assetPath}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
