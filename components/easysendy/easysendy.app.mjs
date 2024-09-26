import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easysendy",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique identifier of the list to which the subscriber is being added.",
      async options({ page }) {
        const { listsData } = await this.listLists({
          params: {
            pageNumber: page + 1,
          },
        });

        return listsData.map(({
          list_uid: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "http://api.easysendy.com/ver1";
    },
    _data(data) {
      return {
        ...data,
        "api_key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, data, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        data: this._data(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...opts,
      });
    },
    addSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribeAPI",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/listAPI",
        data: {
          "req_type": "allLists",
        },
        ...opts,
      });
    },
  },
};
