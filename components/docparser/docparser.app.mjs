import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "docparser",
  propDefinitions: {
    parserId: {
      type: "string",
      label: "Parser ID",
      description: "The ID of the parser to be used.",
      async options() {
        const parsers = await this.listParsers();
        return parsers.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.docparser.com";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    listData({
      parserId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/results/${parserId}`,
        ...opts,
      });
    },
    listParsers() {
      return this._makeRequest({
        path: "/v1/parsers",
      });
    },
    fetchDocumentFromURL({
      parserId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v2/document/fetch/${parserId}`,
        ...opts,
      });
    },
    uploadDocument({
      parserId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v1/document/upload/${parserId}`,
        ...opts,
      });
    },
  },
};
