import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "emailoctopus",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List",
      description: "List where the source will be performed.",
      async options({ page }) {
        const { data } = await this.getLists({
          page: page + 1,
        });

        return data.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
  },
  methods: {
    _getParams(params) {
      const resObj = {
        "api_key": `${this.$auth.api_key}`,
      };
      for (const key in params) {
        resObj[key] = params[key];
      }
      return resObj;
    },
    async _makeRequest({
      $, url, path, params, ...otherConfig
    }) {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;

      const config = {
        url: url || `${baseUrl}${path}`,
        params: this._getParams(params),
        ...otherConfig,
      };
      return axios($ || this, config);
    },
    async getLists({ page }) {
      return this._makeRequest({
        method: "GET",
        path: "/lists",
        params: {
          page,
        },
      });
    },
    async getContacts({ listId }) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/contacts`,
      });
    },
    async getContact({
      listId, contactId,
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/contacts/${contactId}`,
      });
    },
  },
};
