import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "remarkety",
  propDefinitions: {
    page: {
      type: "integer",
      label: "Page",
      description: "Page to return - (1 will return the first page, 2 the second, etc)",
      default: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of records to return",
      default: 100,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://app.remarkety.com/api/v2/stores/${this.$auth.store_id}`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-Key": `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    async *paginate({
      fn, params, resourceKey, max,
    }) {
      params = {
        ...params,
        limit: 100,
        page: 1,
      };
      let count = 0, total = 0;
      do {
        const response = await fn({
          params,
        });
        const items = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        params.page++;
        total = items?.length;
      } while (total === params.limit);
    },
  },
};
