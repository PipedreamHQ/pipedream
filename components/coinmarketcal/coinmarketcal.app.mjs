import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "coinmarketcal",
  propDefinitions: {
    categories: {
      type: "string[]",
      label: "Categories",
      description: "The Ids of the categories.",
      async options() {
        const { body } = await this.listCategories();

        return body.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    coins: {
      type: "string[]",
      label: "Coins",
      description: "The Ids of the coins.",
      async options() {
        const { body } = await this.listCoins();

        return body.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://developers.coinmarketcal.com/v1";
    },
    _getHeaders() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    listCategories(args = {}) {
      return this._makeRequest({
        ...args,
        path: "categories",
      });
    },
    listCoins(args = {}) {
      return this._makeRequest({
        ...args,
        path: "coins",
      });
    },
    searchEvents(args = {}) {
      return this._makeRequest({
        ...args,
        path: "events",
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let length = 0;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { body } = await fn({
          params,
        });
        for (const d of body) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        length = body.length;

      } while (length);
    },
  },
};
