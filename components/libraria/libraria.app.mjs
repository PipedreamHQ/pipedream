import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "libraria",
  propDefinitions: {
    libraryId: {
      label: "Library ID",
      description: "The library ID",
      type: "string",
      async options() {
        const { libraries } = await this.getLibraries();

        return libraries.map((library) => ({
          label: library.name,
          value: library.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.libraria.dev";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async addDocument({
      libraryId, ...args
    }) {
      return this._makeRequest({
        path: `/library/${libraryId}/document`,
        method: "post",
        ...args,
      });
    },
    async createQuery({
      libraryId, ...args
    }) {
      return this._makeRequest({
        path: `/library/${libraryId}/query`,
        method: "post",
        ...args,
      });
    },
    async getLibraries(args = {}) {
      return this._makeRequest({
        path: "/me",
        ...args,
      });
    },
  },
};
