const get = require("lodash.get");
const Shopify = require("shopify-api-node");
const toPath = require("lodash/toPath");
const retry = require("async-retry");

const events = [
  {
    label: "Article Created",
    value: JSON.stringify({
      filter: "Article",
      verb: "create",
    }),
  },
  {
    label: "Article Destroyed",
    value: JSON.stringify({
      filter: "Article",
      verb: "destroy",
    }),
  },
  {
    label: "Article Published",
    value: JSON.stringify({
      filter: "Article",
      verb: "published",
    }),
  },
  {
    label: "Article Unpublished",
    value: JSON.stringify({
      filter: "Article",
      verb: "unpublished",
    }),
  },
  {
    label: "Article Updated",
    value: JSON.stringify({
      filter: "Article",
      verb: "update",
    }),
  },
  {
    label: "Blog Created",
    value: JSON.stringify({
      filter: "Blog",
      verb: "create",
    }),
  },
  {
    label: "Blog Destroyed",
    value: JSON.stringify({
      filter: "Blog",
      verb: "destroy",
    }),
  },
  {
    label: "Collection Created",
    value: JSON.stringify({
      filter: "Collection",
      verb: "create",
    }),
  },
  {
    label: "Collection Destroyed",
    value: JSON.stringify({
      filter: "Collection",
      verb: "destroy",
    }),
  },
  {
    label: "Collection Published",
    value: JSON.stringify({
      filter: "Collection",
      verb: "published",
    }),
  },
  {
    label: "Collection Unpublished",
    value: JSON.stringify({
      filter: "Collection",
      verb: "unpublished",
    }),
  },
  {
    label: "Order Confirmed",
    value: JSON.stringify({
      filter: "Order",
      verb: "confirmed",
    }),
  },
  {
    label: "Page Created",
    value: JSON.stringify({
      filter: "Page",
      verb: "create",
    }),
  },
  {
    label: "Page Destroyed",
    value: JSON.stringify({
      filter: "Page",
      verb: "destroy",
    }),
  },
  {
    label: "Page Published",
    value: JSON.stringify({
      filter: "Page",
      verb: "published",
    }),
  },
  {
    label: "Page Unpublished",
    value: JSON.stringify({
      filter: "Page",
      verb: "unpublished",
    }),
  },
  {
    label: "Price Rule Created",
    value: JSON.stringify({
      filter: "PriceRule",
      verb: "create",
    }),
  },
  {
    label: "Price Rule Destroyed",
    value: JSON.stringify({
      filter: "PriceRule",
      verb: "destroy",
    }),
  },
  {
    label: "Price Rule Updated",
    value: JSON.stringify({
      filter: "PriceRule",
      verb: "update",
    }),
  },
  {
    label: "Product Created",
    value: JSON.stringify({
      filter: "Product",
      verb: "create",
    }),
  },
  {
    label: "Product Destroyed",
    value: JSON.stringify({
      filter: "Product",
      verb: "destroy",
    }),
  },
  {
    label: "Product Published",
    value: JSON.stringify({
      filter: "Product",
      verb: "published",
    }),
  },
  {
    label: "Product Unpublished",
    value: JSON.stringify({
      filter: "Product",
      verb: "unpublished",
    }),
  },
];

module.exports = {
  type: "app",
  app: "shopify",
  propDefinitions: {
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      optional: true,
      description: "Only emit events for the selected event types.",
      options: events,
    },
  },
  methods: {
    _getBaseURL() {
      return `https://${this.$auth.shop_id}.myshopify.com/admin/api/2020-10`;
    },
    _getAuthHeader() {
      return {
        "x-shopify-access-token": this.$auth.oauth_access_token,
      };
    },
    _monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    _jsonPathToGraphQl(path) {
      return toPath(path).reduceRight(
        (accum, item) => accum
          ? `${item} { ${accum} }`
          : item,
      );
    },
    /**
     * Returns if an error code represents a retriable error.
     * @callback isRetriableErrCode
     * @param {string} errCode The error code
     * @returns {boolean} If the error code is retriable
     */
    /**
     * Returns if a GraphQL error code represents a retriable error.
     * @type {isRetriableErrCode}
     */
    _isRetriableGraphQLErrCode(errCode) {
      return errCode === "THROTTLED";
    },
    /**
     * Options for handling error objects returned by API calls.
     * @typedef {Object} ErrorOptions
     * @property {(string|number)[]|string} errCodePath Path to the status/error
     * code in the error object
     * @property {(string|number)[]|string} errDataPath Path to the error data
     * in the error object
     * @property {isRetriableErrCode} isRetriableErrCode Function that returns if
     * the error code is retriable
     */
    /**
     * Returns options for handling GraphQL error objects.
     * @returns {ErrorOptions} The options
     */
    _graphQLErrOpts() {
      // Shopify GraphQL requests are throttled if queries exceed point limit.
      // See https://shopify.dev/concepts/about-apis/rate-limits
      // GraphQL err: { extensions: { code='THROTTLED' }, response: { body: { errors: [] } } }
      return {
        errCodePath: [
          "extensions",
          "code",
        ],
        errDataPath: [
          "response",
          "body",
          "errors",
          "0",
        ],
        isRetriableErrCode: this._isRetriableGraphQLErrCode,
      };
    },
    /**
     *
     * @param {function} apiCall The function that makes the API request
     * @param {object} opts Options for retrying the API call
     * @param {ErrorOptions} opts.errOpts Options for handling errors thrown by the API call
     * @param {object} opts.retryOpts Options for async-retry. See
     * https://www.npmjs.com/package/async-retry
     * @returns {Promise} A promise that resolves to the return value of the apiCall
     */
    async _withRetries(apiCall, opts = {}) {
      const {
        errOpts: {
          errCodePath,
          errDataPath,
          isRetriableErrCode,
        } = this._graphQLErrOpts(),
        retryOpts = {
          retries: 5,
          factor: 2,
          minTimeout: 2000, // In milliseconds
        },
      } = opts;
      return retry(async (bail, retryCount) => {
        try {
          return await apiCall();
        } catch (err) {
          const errCode = get(err, errCodePath);
          if (!isRetriableErrCode(errCode)) {
            const errData = get(err, errDataPath, {});
            return bail(new Error(`
              Unexpected error (error code: ${errCode}):
              ${JSON.stringify(errData, null, 2)}
            `));
          }

          console.log(`
            [Attempt #${retryCount}] Temporary error: ${err.message}
          `);
          throw err;
        }
      }, retryOpts);
    },
    _makeGraphQlRequest(query, variables = {}) {
      const shopifyClient = this.getShopifyInstance();
      return this._withRetries(
        () => shopifyClient.graphql(query, variables),
      );
    },
    dayAgo() {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return dayAgo;
    },
    getShopifyInstance() {
      return new Shopify({
        shopName: this.$auth.shop_id,
        accessToken: this.$auth.oauth_access_token,
        autoLimit: true,
      });
    },
    getSinceParams(sinceId = false, useCreatedAt = false, updatedAfter = null) {
      let params = {};
      if (sinceId) params = {
        ...params,
        since_id: sinceId,
      };
      if (updatedAfter) params = {
        ...params,
        updated_at_min: updatedAfter,
      };
      // If no sinceId or updatedAfter, get objects created within the last month
      if (!sinceId && !updatedAfter && useCreatedAt) return {
        created_at_min: this._monthAgo(),
      };
      return params;
    },
    async getObjects(objectType, params = {}, id = null) {
      const shopify = this.getShopifyInstance();
      let objects = [];
      do {
        const results = id
          ? await shopify[objectType].list(id, params)
          : await shopify[objectType].list(params);
        objects = objects.concat(results);
        params = results.nextPageParameters;
      } while (params !== undefined);
      return objects;
    },
    async getAbandonedCheckouts(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("checkout", params);
    },
    async getArticles(blogId, sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("article", params, blogId);
    },
    async getBlogs() {
      return await this.getObjects("blog");
    },
    async getCustomers(sinceId, updatedAfter) {
      let params = this.getSinceParams(sinceId, true, updatedAfter);
      return await this.getObjects("customer", params);
    },
    async getEvents(sinceId, filter = null, verb = null) {
      let params = this.getSinceParams(sinceId, true);
      params.filter = filter;
      params.verb = verb;
      return await this.getObjects("event", params);
    },
    async getOrders(fulfillmentStatus, useCreatedAt = false, sinceId = null, updatedAfter = null, status = "any") {
      let params = this.getSinceParams(sinceId, useCreatedAt, updatedAfter);
      params.status = status;
      params.fulfillment_status = fulfillmentStatus;
      return await this.getObjects("order", params);
    },
    async getOrdersById(ids = []) {
      if (ids.length === 0) {
        return [];
      }
      const params = {
        ids: ids.join(","),
        status: "any",
        limit: 100,
      };
      return await this.getObjects("order", params);
    },
    async getPages(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("page", params);
    },
    async getProducts(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("product", params);
    },
    async *queryOrders(opts = {}) {
      const {
        sortKey = "UPDATED_AT",
        filter = "",
        fields = [],
      } = opts;
      const nodeFields = [
        "id",
        ...fields.map(this._jsonPathToGraphQl),
      ].join("\n");
      const query = `
        query orders($after: String, $filter: String, $sortKey: OrderSortKeys) {
          orders(after: $after, first: 100, query: $filter, sortKey: $sortKey) {
            pageInfo {
              hasNextPage
            }
            edges {
              cursor
              node {
                ${nodeFields}
              }
            }
          }
        }
      `;

      let { prevCursor: after = null } = opts;
      while (true) {
        const variables = {
          after,
          filter,
          sortKey,
        };
        const { orders } = await this._makeGraphQlRequest(query, variables);
        const { edges = [] } = orders;
        for (const edge of edges) {
          const {
            node: order,
            cursor,
          } = edge;
          yield {
            order,
            cursor,
          };
          after = cursor;
        }

        if (!orders.pageInfo.hasNextPage) {
          return;
        }
      }
    },
  },
};
