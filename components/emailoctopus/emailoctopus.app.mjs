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
    async *paginate({
      $, fn, params = {}, page = 1,
    }) {
      const { limit } = params;
      let count = 0;
      do {
        const {
          data,
          paging,
        } = await fn({
          $,
          params: {
            ...params,
            page,
          },
        });
        for (const d of data) {
          yield d;
          if (limit && ++count === limit) {
            return count;
          }
        }
        page = paging.next && page + 1;
      } while (page);
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
    async getContacts({ params }) {
      const {
        listId,
        ...otherParams
      } = params;
      return this._makeRequest({
        method: "GET",
        path: `/lists/${listId}/contacts`,
        params: {
          ...otherParams,
        },
      });
    },
    getSubscribers({ params }) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${params.listId}/contacts/subscribed`,
        params: {
          ...params,
        },
      });
    },
    getUnsubscribers({ params }) {
      return this._makeRequest({
        method: "GET",
        path: `/lists/${params.listId}/contacts/unsubscribed`,
        params: {
          ...params,
        },
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
    async createList(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/lists",
        ...args,
      });
    },
    async addContactToList({
      listId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/contacts`,
        ...args,
      });
    },
  },
};
