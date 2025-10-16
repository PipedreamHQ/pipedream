import { axios } from "@pipedream/platform";
import { prepareList } from "./common/utils.mjs";

export default {
  type: "app",
  app: "bitport",
  propDefinitions: {
    folderCode: {
      type: "string",
      label: "Folder Code",
      description: "The code of the folder to add the item to",
      async options() {
        const { data } = await this.listFolders();

        return prepareList({
          items: data,
        }).map((item) => ({
          label: item.fullName,
          value: item.code,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.bitport.io/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    search({
      query, ...opts
    }) {
      return this._makeRequest({
        path: `/search/${query}`,
        ...opts,
      });
    },
    listFolders() {
      return this._makeRequest({
        path: "/cloud/byPath",
        params: {
          scope: "recursive",
        },
      });
    },
    addItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transfers",
        ...opts,
      });
    },
  },
};
