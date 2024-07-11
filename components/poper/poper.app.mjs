import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "poper",
  propDefinitions: {
    poperId: {
      type: "string",
      label: "Poper ID",
      description: "The ID of the Poper popup",
      async options() {
        const { popups } = await this.listPopups();
        return popups.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.poper.ai/general/v1";
    },
    _data(data = {}) {
      return {
        ...data,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl() + path,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this._data(data),
        ...opts,
      });
    },
    listPopups() {
      return this._makeRequest({
        path: "/popup/list",
      });
    },
    listPoperResponses(opts = {}) {
      return this._makeRequest({
        path: "/popup/responses",
        ...opts,
      });
    },
  },
};
