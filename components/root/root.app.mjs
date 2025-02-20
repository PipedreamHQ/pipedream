import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "your_app_name",
  version: "0.0.{{ts}}",
  propDefinitions: {
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item to retrieve",
    },
    // Add more prop definitions as required by your API
  },
  methods: {
    _baseUrl() {
      return "https://api.your_app.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers = {},
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    async listItems(opts = {}) {
      return this._makeRequest({
        path: "/items",
        method: "GET",
        ...opts,
      });
    },
    async getItem(opts = {}) {
      const { itemId } = opts;
      if (!itemId) {
        throw new Error("The 'itemId' prop is required for getItem.");
      }
      return this._makeRequest({
        path: `/items/${itemId}`,
        method: "GET",
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }

      return results;
    },
  },
};
