import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "generated_photos",
  propDefinitions: {
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return",
      optional: true,
      default: 10,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.generated.photos/api/v1";
    },
    _authParams(params) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    generateFaces(args = {}) {
      return this._makeRequest({
        path: "/faces",
        ...args,
      });
    },
    generateSimilarFaces(args = {}) {
      return this._makeRequest({
        path: "/faces/similars",
        ...args,
      });
    },
  },
};
