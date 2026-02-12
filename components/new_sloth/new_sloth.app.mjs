import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "new_sloth",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.newsloth.com/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_key}`,
          password: `${this.$auth.api_secret}`,
        },
        ...opts,
      });
    },
    listSources(opts = {}) {
      return this._makeRequest({
        path: "/sources",
        ...opts,
      });
    },
    createSource(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sources",
        ...opts,
      });
    },
    deleteSource({
      sourceId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/sources/${sourceId}`,
        ...opts,
      });
    },
  },
};
