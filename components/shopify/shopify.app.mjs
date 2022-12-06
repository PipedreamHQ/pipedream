import get from "lodash.get";
import Shopify from "shopify-api-node";
import toPath from "lodash.topath";
import retry from "async-retry";
import events from "./sources/common/events.mjs";
import { toSingleLineString } from "./actions/common/common.mjs";

export default {
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
    productId: {
      type: "string",
      label: "Product ID",
      description: "ID of the product. Option displayed here as the title of the product",
      async options({ prevContext }) {
        const defaultParams = {
          limit: 50,
        };
        const { nextPageParameters = defaultParams } = prevContext;
        const response = await this.resourceAction("product", "list", nextPageParameters);
        return {
          options: response.result.map((e) => ({
            label: e.title,
            value: e.id,
          })),
          context: {
            nextPageParameters: response.nextPageParameters,
          },
        };
      },
    },
    productVariantId: {
      type: "string",
      label: "Product Variant ID",
      description: "ID of the product variant",
      async options({
        productId,
        prevContext,
      }) {
        const defaultParams = {
          fields: "id,title",
        };
        const { nextPageParameters = defaultParams } = prevContext;
        const response = await this.resourceAction("productVariant", "list", nextPageParameters, productId);
        return {
          options: response.result.map((e) => ({
            label: e.title,
            value: e.id,
          })),
          context: {
            nextPageParameters: response.nextPageParameters,
          },
        };
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The Customer ID. Option displayed here as email registered with the Customer ID",
      useQuery: true,
      async options({
        prevContext,
        query,
      }) {
        const defaultParams = {
          limit: 50,
          query,
        };
        const { nextPageParameters = defaultParams } = prevContext;
        const response = await this.resourceAction("customer", "search", nextPageParameters);
        return {
          options: response.result.map((e) => ({
            label: e.email,
            value: e.id,
          })),
          context: {
            nextPageParameters: response.nextPageParameters,
          },
        };
      },
    },
    locationId: {
      type: "string",
      label: "Location ID",
      description: "The ID of the location that the inventory level belongs to. Options will display the name of the Location ID",
      async options() {
        const response = await this.getLocationIds();
        return response.result.map((e) => ({
          label: e.name,
          value: e.id,
        }));
      },
    },
    inventoryItemId: {
      type: "string",
      label: "Inventory Item ID",
      description: toSingleLineString(`
        The ID of the inventory item associated with the inventory level.
        There is a 1:1 relationship between a product variant and an inventory item.
        Each product variant includes the ID of its related inventory item.
        To view a list of Inventory Items, choose a product using the field above
      `),
      async options({
        productId,
        prevContext,
      }) {
        if (!productId) {
          return [];
        }
        const defaultParams = {
          fields: "title,inventory_item_id",
        };
        const { nextPageParameters = defaultParams } = prevContext;
        const response = await this.resourceAction("productVariant", "list", nextPageParameters, productId);
        return {
          options: response.result.map((e) => ({
            label: e.title,
            value: e.inventory_item_id,
          })),
          context: {
            nextPageParameters: response.nextPageParameters,
          },
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The customer's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The customer's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The unique email address of the customer",
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: toSingleLineString(`
          The unique phone number (E.164 format) for this customer.
          Check out [Shopify Customer API](https://shopify.dev/api/admin-rest/2022-01/resources/customer#[post]/admin/api/#{api_version}/customers.json_examples) for more details on valid formats
        `),
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "The customer's mailing address",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The customer's company",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The customer's city, town, or village",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "The customer's region name. Typically a province, a state, or a prefecture",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The customer's country",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip Code",
      description: "The customer's postal code",
      optional: true,
    },
    sendEmailInvite: {
      type: "boolean",
      label: "Send Email Invite",
      description: "Send email invite to address",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the product",
    },
    productDescription: {
      type: "string",
      label: "Product Description",
      description: "A description of the product. Supports HTML formatting. Example: `<strong>Good snowboard!</strong>`",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price of the product",
      optional: true,
    },
    vendor: {
      type: "string",
      label: "Vendor",
      description: "The name of the product's vendor",
      optional: true,
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "A categorization for the product used for filtering and searching products",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: toSingleLineString(`
        The status of the product.
        \`active\`: The product is ready to sell and is available to customers on the online store, sales channels, and apps. By default, existing products are set to active.
        \`archived\`: The product is no longer being sold and isn't available to customers on sales channels and apps.
        \`draft\`: The product isn't ready to sell and is unavailable to customers on sales channels and apps. By default, duplicated and unarchived products are set to draft
      `),
      optional: true,
      options: [
        "active",
        "archived",
        "draft",
      ],
    },
    images: {
      type: "string[]",
      label: "Images",
      description: toSingleLineString(`
        A list of product base64 encoded image objects.
        Each one represents an image associated with the product or a link that will be downloaded by Shopify.
        Example: \`["R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==","http://example.com/rails_logo.gif"]\`.
        More information at [Shopify Product API](https://shopify.dev/api/admin-rest/2022-01/resources/product#[post]/admin/api/2022-01/products.json)
      `),
      optional: true,
    },
    options: {
      type: "string[]",
      label: "Options",
      description: toSingleLineString(`
        The custom product properties.
        For example, Size, Color, and Material. Each product can have up to 3 options and each option value can be up to 255 characters.
        Product variants are made of up combinations of option values. Options cannot be created without values.
        To create new options, a variant with an associated option value also needs to be created.
        Example: \`[{"name":"Color","values":["Blue","Black"]},{"name":"Size","values":["155","159"]}]\`
      `),
      optional: true,
    },
    variants: {
      type: "string[]",
      label: "Product Variants",
      description: toSingleLineString(`
        An array of product variants, each representing a different version of the product.
        The position property is read-only. The position of variants is indicated by the order in which they are listed.
        Example: \`[{"option1":"First","price":"10.00","sku":"123"},{"option1":"Second","price":"20.00","sku":"123"}]\`
      `),
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: toSingleLineString(`
        A string of comma-separated tags that are used for filtering and search. A product can have up to 250 tags. Each tag can have up to 255 characters.
        Example: \`"Barnes & Noble","Big Air","John's Fav"\`
      `),
      optional: true,
    },
    option: {
      type: "string",
      label: "Title",
      description: "The option name of the product variant",
    },
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The unique numeric identifier for a product's image. The image must be associated to the same product as the variant",
      optional: true,
      async options({ productId }) {
        if (!productId) {
          return [];
        }
        const response = await this.resourceAction("productImage", "list", {
          fields: "src,id",
        }, productId);
        return response.result.map((e) => ({
          label: e.src,
          value: e.id,
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    max: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
  },
  methods: {
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
          return apiCall();
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
    /**
     * Removes empty key and values from params objects
     * Shopify lib doesn't handle this and therefore many requests are rejected
     * @param {object} params
     * @returns {object} Clear of empty key/values
    */
    _makeRequestOpts(params) {
      for (const key of Object.keys(params)) {
        const value = params[key];

        if (typeof value == "boolean") {
          continue;
        }
        if (Array.isArray(value)
          && (value.length === 0
            || (value.length === 1
              && value[0] === ""))) {
          delete params[key];
        }
        else if (!(key && (value || value === 0))) {
          delete params[key];
        }
        else if (value.constructor == Object) {
          this._makeRequestOpts(params[key]);
          if (Object.values(params[key]).length === 0) {
            delete params[key];
          }
        }
      }
      return params;
    },
    _throwFormattedError(err) {
      err = err.response;
      throw Error(`${err.statusCode} - ${err.statusMessage} - ${JSON.stringify(err.body)}`);
    },
    /**
     * Transforms a string to an object or returns the object
     * @param {string} stringObject
     * @returns {object}
     */
    parseJSONStringObjects(stringObject) {
      if (!stringObject) {
        return {};
      }
      if (typeof stringObject == "string") {
        stringObject = JSON.parse(stringObject);
      }
      return this._makeRequestOpts(stringObject);
    },
    /**
     * Transforms a list of strings to a list of objects
     * @param {string[]} stringList
     * @returns {object[]}
     */
    parseArrayOfJSONStrings(stringList) {
      if (!stringList) {
        return [];
      }
      if (typeof stringList == "string") {
        throw new Error("string type not supported, please use array of objects in structured mode");
      }
      return stringList.map((x) => x
        ? this.parseJSONStringObjects(x)
        : x).filter((x) => Object.values(x).length > 0);
    },
    /**
     * Transforms a list of strings to a comma-separated string
     * @param {string[]} value
     * @returns {string}
     */
    parseCommaSeparatedStrings(value) {
      if (Array.isArray(value)) {
        return value.join();
      }
      if (value === undefined || typeof value == "string") {
        return value;
      }
      throw new TypeError("variable should be an array or string");
    },
    parseImages(images) {
      if (!images) return [];
      return images.map((image) => ({
        [image.includes("http")
          ? "src"
          : "attachment"]: image,
      }));
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
    getSinceParams(sinceId = false, useCreatedAt = false, updatedAfter = null, params = {}) {
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
    /**
     * Uses Shopify lib for API requests according to resource and action
     * @param {string} objectType Shopify resource
     * @param {string} action Shopify resource method
     * @param {object} params JSON or Query request parameters
     * @param {string} id Resource ID if expected
     * @returns {object} Shopify resource action result
     */
    async resourceAction(objectType, action, params = {}, id = null) {
      const shopify = this.getShopifyInstance();
      this._makeRequestOpts(params);
      try {
        const result = id
          ? await shopify[objectType][action](id, params)
          : await shopify[objectType][action](params);
        return {
          result,
          nextPageParameters: result.nextPageParameters,
        };
      } catch (err) {
        this._throwFormattedError(err);
      }
    },
    async *paginate(resourceFn, params, max = null) {
      let nextParams = params;
      let count = 0;
      do {
        const {
          result,
          nextPageParameters,
        } = await resourceFn(nextParams);
        for (const item of result) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        // pass cursor to get next page of results; if no cursor, no more pages
        nextParams = nextPageParameters;
      } while (nextParams !== undefined);
    },
    async getPaginatedResults(resourceFn, params, max) {
      const results = [];
      const resourceStream = await this.paginate(resourceFn, params, max);
      for await (const result of resourceStream) {
        results.push(result);
      }
      return results;
    },
    async getAbandonedCheckouts(sinceId) {
      const params = this.getSinceParams(sinceId, true);
      return this.getObjects("checkout", params);
    },
    async getArticles(blogId, sinceId) {
      const params = this.getSinceParams(sinceId, true);
      return this.getObjects("article", params, blogId);
    },
    async getBlogs() {
      return this.getObjects("blog");
    },
    async getCustomers(sinceId, updatedAfter, params = {}) {
      if (Object.values(this._makeRequestOpts(params)).length > 0) {
        return this.resourceAction("customer", "list", params);
      } else {
        params = this.getSinceParams(sinceId, true, updatedAfter);
        return this.getObjects("customer", params);
      }
    },
    async createCustomer(params) {
      return this.resourceAction("customer", "create", params);
    },
    async updateCustomer(customerId, params) {
      return this.resourceAction("customer", "update", params, customerId);
    },
    async searchCustomers(params = {}) {
      return this.resourceAction("customer", "search", params);
    },
    async getEvents(sinceId, filter = null, verb = null) {
      const params = this.getSinceParams(sinceId, true);
      params.filter = filter;
      params.verb = verb;
      return this.getObjects("event", params);
    },
    async getDraftOrders(fulfillmentStatus) {
      return this.getObjects("draftOrder", {
        fulfillment_status: fulfillmentStatus,
      });
    },
    async getOrders(fulfillmentStatus, useCreatedAt = false, sinceId = null, updatedAfter = null, status = "any") {
      const params = this.getSinceParams(sinceId, useCreatedAt, updatedAfter);
      params.status = status;
      params.fulfillment_status = fulfillmentStatus;
      return this.getObjects("order", params);
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
      return this.getObjects("order", params);
    },
    async createOrder(params) {
      return this.resourceAction("order", "create", params);
    },
    async getPages(sinceId) {
      const params = this.getSinceParams(sinceId, true);
      return this.getObjects("page", params);
    },
    async getProducts(sinceId, useCreatedAt = true, params = {}) {
      this.getSinceParams(sinceId, useCreatedAt, null, params);
      return this.getObjects("product", params);
    },
    async getProduct(productId, params) {
      return this.resourceAction("product", "get", params, productId);
    },
    async updateProduct(productId, params) {
      return this.resourceAction("product", "update", params, productId);
    },
    async getProductVariant(productVariantId, params) {
      return this.resourceAction("productVariant", "get", params, productVariantId);
    },
    async getProductVariantByTitle(productId, title, params) {
      let list = (await this.resourceAction("productVariant", "list", params, productId)).result;
      list = list.filter((e) => e.title == title);
      if (list.length === 0) {
        throw new Error(`Product variant with title ${title} not found`);
      }
      return list[0];
    },
    async updateProductVariant(productVariantId, params) {
      return this.resourceAction("productVariant", "update", params, productVariantId);
    },
    async createProduct(params) {
      return this.resourceAction("product", "create", params);
    },
    async createProductVariant(productId, params) {
      return this.resourceAction("productVariant", "create", params, productId);
    },
    async createSmartCollection(params) {
      return this.resourceAction("smartCollection", "create", params);
    },
    async getLocationIds() {
      return this.resourceAction("location", "list");
    },
    async updateInventoryLevel(params) {
      return this.resourceAction("inventoryLevel", "set", params);
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
    /**
     * Adds tags to a resource type.
     * @param {string} resource Type of resource to query
     * @param {string} id Resource ID
     * @param {string} tagString List of tags to add
     * @returns {object} Response from Shopify GraphQL API
     */
    async addTags(resource, id, tagString) {
      const gid = `gid://shopify/${resource}/${id}`;

      let tags = [
        tagString,
      ];
      if (tags.includes(",")) {
        tags = tagString.split(",").map((item) => item.trim());
      }

      const query = `
        mutation tagsAdd($gid: ID!, $tags: [String!]!) {
          tagsAdd(id: $gid, tags: $tags) {
            node {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        gid,
        tags,
      };

      return await this._makeGraphQlRequest(query, variables);
    },
  },
};
