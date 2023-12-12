import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "regfox",
  propDefinitions: {
    forms: {
      type: "string[]",
      label: "Forms",
      description: "The IDs of the forms you want to subscribe to",
      async options({ prevContext }) {
        const {
          data = [],
          hasMore,
        } = await this.listForms({
          params: {
            startingAfter: prevContext?.lastId,
            limit: constants.ASYNC_OPTIONS_LIMIT,
          },
        });

        if (!hasMore) {
          return data;
        }

        return {
          options: data,
          context: {
            lastId: this.getLastId(data),
          },
        };
      },
    },
  },
  methods: {
    getLastId(data = []) {
      return data[data.length - 1]?.id;
    },
    _baseUrl() {
      return "https://api.webconnex.com/v2/public";
    },
    _auth() {
      return {
        apiKey: this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          ...this._auth(),
        },
      });
    },
    async createWebhook(data) {
      return this._makeRequest({
        path: "/webhooks",
        method: "post",
        data,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        path: `/webhooks/${id}`,
        method: "delete",
      });
    },
    async listForms({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listForms,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    async listRegistrants({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listRegistrants,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/search/registrants",
        ...opts,
      });
    },
    async listTransactions({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          fn: this.listTransactions,
          ...opts,
        });
      }
      return this._makeRequest({
        path: "/search/transactions",
        ...opts,
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        limit: constants.MAX_LIMIT,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response.data);
        opts.params.startingAfter = this.getLastId(data);
        if (!response.hasMore) {
          break;
        }
      }

      return {
        data,
      };
    },
  },
};
