import Shopify from "shopify-api-node";
import get from "lodash.get";
import retry from "async-retry";
import mutations from "./common/mutations.mjs";
import queries from "./common/queries.mjs";
import {
  DEFAULT_LIMIT, MAX_LIMIT, API_VERSION,
} from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "shopify",
  propDefinitions: {
    blogId: {
      type: "string",
      label: "Blog ID",
      description: "The identifier of a blog",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listBlogs,
          resourceKeys: [
            "blogs",
          ],
          prevContext,
        });
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The identifier of an article",
      async options({
        prevContext, blogId,
      }) {
        return this.getPropOptions({
          resourceFn: this.listBlogArticles,
          resourceKeys: [
            "blog",
            "articles",
          ],
          variables: {
            id: blogId,
          },
          prevContext,
        });
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The identifier of a product",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listProducts,
          resourceKeys: [
            "products",
          ],
          prevContext,
        });
      },
    },
    productVariantId: {
      type: "string",
      label: "Product Variant ID",
      description: "The identifier of a product variant",
      async options({
        prevContext, productId,
      }) {
        return this.getPropOptions({
          resourceFn: this.listProductVariants,
          resourceKeys: [
            "productVariants",
          ],
          variables: {
            query: `product_id:${utils.getIdFromGid(productId)}`,
          },
          prevContext,
        });
      },
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The identifier of a collection",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listCollections,
          resourceKeys: [
            "collections",
          ],
          prevContext,
        });
      },
    },
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The identifier of a page",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listPages,
          resourceKeys: [
            "pages",
          ],
          prevContext,
        });
      },
    },
    metaobjectType: {
      type: "string",
      label: "Type",
      description: "The metaobject type",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listMetaobjectDefinitions,
          resourceKeys: [
            "metaobjectDefinitions",
          ],
          labelKey: "type",
          prevContext,
        });
      },
    },
    metaobjectId: {
      type: "string",
      label: "Metaobject ID",
      description: "The metaobject to update",
      async options({
        prevContext, type,
      }) {
        const { metaobjectDefinitions: { nodes } } = await this.listMetaobjectDefinitions({
          first: MAX_LIMIT,
        });
        const { type: typeName } = nodes.find(({ id }) => id === type);
        return this.getPropOptions({
          resourceFn: this.listMetaobjects,
          resourceKeys: [
            "metaobjects",
          ],
          labelKey: "displayName",
          variables: {
            type: typeName,
          },
          prevContext,
        });
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location that the inventory level belongs to. Options will display the name of the Location ID",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listLocations,
          resourceKeys: [
            "locations",
          ],
          labelKey: "name",
          prevContext,
        });
      },
    },
    inventoryItemId: {
      type: "string",
      label: "Inventory Item ID",
      description: "The ID of the inventory item associated with the inventory level. There is a 1:1 relationship between a product variant and an inventory item. Each product variant includes the ID of its related inventory item. To view a list of Inventory Items, choose a product using the field above",
      async options({
        prevContext, productId,
      }) {
        const variables = {
          query: `product_id:${utils.getIdFromGid(productId)}`,
          first: DEFAULT_LIMIT,
        };
        if (prevContext?.after) {
          variables.after = prevContext.after;
        }
        let {
          productVariants: {
            nodes, pageInfo,
          },
        } = await this.listProductVariants(variables);
        return {
          options: nodes?.map(({
            inventoryItem, title: label,
          }) => ({
            value: inventoryItem.id,
            label,
          })),
          context: {
            after: pageInfo?.endCursor,
          },
        };
      },
    },
    productOptionIds: {
      type: "string[]",
      label: "Options",
      description: "The product options to apply to the product variant",
      async options({ productId }) {
        const { product: { options } } = await this.getProduct({
          id: productId,
          first: MAX_LIMIT,
        });
        const productOptions = [];
        for (const option of options) {
          for (const optionValue of option.optionValues) {
            productOptions.push({
              value: optionValue.id,
              label: `${option.name} - ${optionValue.name}`,
            });
          }
        }
        return productOptions;
      },
    },
    sortKey: {
      type: "string",
      label: "Sort Key",
      description: "The key to sort the results by",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
    reverse: {
      type: "boolean",
      label: "Sort Descending",
      description: "Sort the results in descending order. Defaults to ascending.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of tags to add",
    },
    metafields: {
      type: "string[]",
      label: "Metafields",
      description: "An array of objects, each one representing a metafield. If adding a new metafield, the object should contain `key`, `value`, `type`, and `namespace`. Example: `{{ [{ \"key\": \"new\", \"value\": \"newvalue\", \"type\": \"single_line_text_field\", \"namespace\": \"global\" }] }}`. To update an existing metafield, use the `id` and `value`. Example: `{{ [{ \"id\": \"28408051400984\", \"value\": \"updatedvalue\" }] }}`",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The identifier of an order",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listOrders,
          resourceKeys: [
            "orders",
          ],
          labelKey: "name",
          prevContext,
        });
      },
    },
    draftOrderId: {
      type: "string",
      label: "Draft Order ID",
      description: "The identifier of a draft order",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listDraftOrders,
          resourceKeys: [
            "draftOrders",
          ],
          labelKey: "name",
          prevContext,
        });
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The identifier of a customer",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listCustomers,
          resourceKeys: [
            "customers",
          ],
          labelKey: "email",
          prevContext,
        });
      },
    },
    fulfillmentOrderId: {
      type: "string",
      label: "Fulfillment Order ID",
      description: "The identifier of a fulfillment order",
      async options({ prevContext }) {
        return this.getPropOptions({
          resourceFn: this.listAssignedFulfillmentOrders,
          resourceKeys: [
            "assignedFulfillmentOrders",
          ],
          labelKey: "id",
          prevContext,
        });
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
    async getPropOptions({
      resourceFn, resourceKeys = [], variables, valueKey = "id", labelKey = "title", prevContext,
    }) {
      variables = {
        ...variables,
        first: DEFAULT_LIMIT,
      };
      if (prevContext?.after) {
        variables.after = prevContext.after;
      }
      let results = await resourceFn(variables);
      for (const key of resourceKeys) {
        results = results[key];
      }
      const {
        nodes, pageInfo,
      } = results;
      return {
        options: nodes?.map((node) => ({
          value: node[valueKey],
          label: node[labelKey],
        })),
        context: {
          after: pageInfo?.endCursor,
        },
      };
    },
    createWebhook(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_WEBHOOK, variables);
    },
    deleteWebhook(webhookId) {
      return this._makeGraphQlRequest(mutations.DELETE_WEBHOOK, {
        id: webhookId,
      });
    },
    listAbandonedCheckouts(variables) {
      return this._makeGraphQlRequest(queries.LIST_ABANDONED_CHECKOUTS, variables);
    },
    listBlogArticles(variables) {
      return this._makeGraphQlRequest(queries.LIST_BLOG_ARTICLES, variables);
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
    listCollections(variables) {
      return this._makeGraphQlRequest(queries.LIST_COLLECTIONS, variables);
    },
    listProductVariants(variables) {
      return this._makeGraphQlRequest(queries.LIST_PRODUCT_VARIANTS, variables);
    },
    listMetaobjects(variables) {
      return this._makeGraphQlRequest(queries.LIST_METAOBJECTS, variables);
    },
    listMetaobjectDefinitions(variables) {
      return this._makeGraphQlRequest(queries.LIST_METAOBJECT_DEFINITIONS, variables);
    },
    listLocations(variables) {
      return this._makeGraphQlRequest(queries.LIST_LOCATIONS, variables);
    },
    getProduct(variables) {
      return this._makeGraphQlRequest(queries.GET_PRODUCT, variables);
    },
    getProductVariant(variables) {
      return this._makeGraphQlRequest(queries.GET_PRODUCT_VARIANT, variables);
    },
    getCollection(variables) {
      return this._makeGraphQlRequest(queries.GET_COLLECTION, variables);
    },
    getBlog(variables) {
      return this._makeGraphQlRequest(queries.GET_BLOG, variables);
    },
    getPage(variables) {
      return this._makeGraphQlRequest(queries.GET_PAGE, variables);
    },
    getArticle(variables) {
      return this._makeGraphQlRequest(queries.GET_ARTICLE, variables);
    },
    addTags(variables) {
      return this._makeGraphQlRequest(mutations.ADD_TAGS, variables);
    },
    addProductsToCollection(variables) {
      return this._makeGraphQlRequest(mutations.ADD_PRODUCTS_TO_COLLECTION, variables);
    },
    createArticle(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_ARTICLE, variables);
    },
    createBlog(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_BLOG, variables);
    },
    createCollection(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_COLLECTION, variables);
    },
    createPage(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_PAGE, variables);
    },
    createProduct(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_PRODUCT, variables);
    },
    createProductVariants(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_PRODUCT_VARIANTS, variables);
    },
    createMetafield(variables) {
      return this._makeGraphQlRequest(mutations.CREATE_METAFIELD, variables);
    },
    updateMetafield(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_METAFIELD, variables);
    },
    updateProduct(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_PRODUCT, variables);
    },
    updateArticle(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_ARTICLE, variables);
    },
    updatePage(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_PAGE, variables);
    },
    updateInventoryLevel(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_INVENTORY_LEVEL, variables);
    },
    updateProductVariant(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_PRODUCT_VARIANT, variables);
    },
    deleteArticle(variables) {
      return this._makeGraphQlRequest(mutations.DELETE_ARTICLE, variables);
    },
    deleteBlog(variables) {
      return this._makeGraphQlRequest(mutations.DELETE_BLOG, variables);
    },
    deletePage(variables) {
      return this._makeGraphQlRequest(mutations.DELETE_PAGE, variables);
    },
    deleteMetafield(variables) {
      return this._makeGraphQlRequest(mutations.DELETE_METAFIELD, variables);
    },
    listOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_ORDERS, variables);
    },
    getDraftOrder(variables) {
      return this._makeGraphQlRequest(queries.GET_DRAFT_ORDER, variables);
    },
    listDraftOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_DRAFT_ORDERS, variables);
    },
    updateOrder(variables) {
      return this._makeGraphQlRequest(mutations.UPDATE_ORDER, variables);
    },
    getCustomer(variables) {
      return this._makeGraphQlRequest(queries.GET_CUSTOMER, variables);
    },
    listCustomers(variables) {
      return this._makeGraphQlRequest(queries.LIST_CUSTOMERS, variables);
    },
    listAssignedFulfillmentOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_ASSIGNED_FULFILLMENT_ORDERS, variables);
    },
    getFulfillmentOrder(variables) {
      return this._makeGraphQlRequest(queries.GET_FULFILLMENT_ORDER, variables);
    },
    listFulfillmentOrders(variables) {
      return this._makeGraphQlRequest(queries.LIST_FULFILLMENT_ORDERS, variables);
    },
    async *paginate({
      resourceFn, resourceKeys = [], variables = {}, max,
    }) {
      variables = {
        ...variables,
        first: MAX_LIMIT,
      };
      let after, count = 0;
      do {
        let results = await resourceFn(variables);
        for (const key of resourceKeys) {
          results = results[key];
        }
        const {
          nodes, pageInfo,
        } = results;
        for (const node of nodes) {
          yield node;
          if (max && ++count >= max) {
            return;
          }
        }
        after = pageInfo.endCursor;
        variables.after = after;
      } while (after);
    },
    async getPaginated(opts) {
      let results = [];
      const items = this.paginate(opts);
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
  },
};
