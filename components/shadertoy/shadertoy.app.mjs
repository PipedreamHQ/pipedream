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
      return "https://www.shadertoy.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        params: {
          ...params,
          key: `${this.$auth.app_key}`,
        },
      });
    },
    async searchShaders({
      query, ...args
    }) {
      return this._makeRequest({
        path: `/api/v1/shaders/query/${query}`,
        ...args,
      });
    },
    async getShaderById({
      shaderId, ...args
    }) {
      return this._makeRequest({
        path: `/api/v1/shaders/${shaderId}`,
        ...args,
      });
    },
    async listShaders(args = {}) {
      return this._makeRequest({
        path: "/api/v1/shaders",
        ...args,
      });
    },
    async getShaderAsset({
      assetSource, ...args
    }) {
      return this._makeRequest({
        path: `/media/previz/${assetSource}`,
        ...args,
      });
    },
  },
};
