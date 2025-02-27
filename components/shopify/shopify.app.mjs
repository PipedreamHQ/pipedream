import Shopify from "shopify-api-node";
import get from "lodash.get";
import retry from "async-retry";
import mutations from "./common/mutations.mjs";
import queries from "./common/queries.mjs";
import {
  DEFAULT_LIMIT, API_VERSION,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "shopify",
  propDefinitions: {
    blogId: {
      type: "string",
      label: "Blogs",
      description: "The identifier of a blog",
      async options({ prevContext }) {
        const variables = {
          first: DEFAULT_LIMIT,
        };
        if (prevContext?.after) {
          variables.after = prevContext.after;
        }
        const {
          blogs: {
            nodes, pageInfo,
          },
        } = await this.listBlogs(variables);
        return {
          options: nodes?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })),
          context: {
            after: pageInfo?.endCursor,
          },
        };
      },
    },
  },
  methods: {
    getShopId() {
      return this.$auth.shop_id;
    },
    getShopifyInstance() {
      return new Shopify({
        shopName: this.getShopId(),
        accessToken: this.$auth.oauth_access_token,
        autoLimit: true,
        apiVersion: API_VERSION,
      });
    },
    _makeGraphQlRequest(query, variables = {}) {
      const shopifyClient = this.getShopifyInstance();
      return this._withRetries(
        () => shopifyClient.graphql(query, variables),
      );
    },
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
    _isRetriableGraphQLErrCode(errCode) {
      return errCode === "THROTTLED";
    },
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
    createWebhook(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_WEBHOOK, variables);
    },
    deleteWebhook(webhookId) {
      return this._makeGraphQlRequest(mutations.DELETE_WEBHOOK, {
        id: webhookId,
      });
    },
    getBlog(variables) {
      return this._makeGraphQlRequest(queries.GET_BLOG, variables);
    },
    listBlogs(variables) {
      return this._makeGraphQlRequest(queries.LIST_BLOGS, variables);
    },
    listPages(variables) {
      return this._makeGraphQlRequest(queries.LIST_PAGES, variables);
    },
    listProducts(variables) {
      return this._makeGraphQlRequest(queries.LIST_PRODUCTS, variables);
    },
  },
};
