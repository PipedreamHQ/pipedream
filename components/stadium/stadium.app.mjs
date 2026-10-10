import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stadium",
  propDefinitions: {
    storeNumber: {
      type: "string",
      label: "Store Number",
      description: "The store number (e.g., `S235588918`)",
      async options() {
        const { stores } = await this.listStores();
        return stores.map((store) => ({
          label: `${store.name} (${store.number})`,
          value: store.number,
        }));
      },
    },
    orderNumber: {
      type: "string",
      label: "Order Number",
      description: "The order number (e.g., `R211027588`)",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "2-digit ISO country code (e.g., `US`, `IN`). Default is `US`",
      optional: true,
      default: "US",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      default: 1,
      min: 1,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of items per page",
      default: 25,
      min: 1,
    },
  },
  methods: {
    /**
     * Get the base URL for the Stadium API
     *
     * @returns {string} The base URL
     */
    _baseUrl() {
      return "https://api.bystadium.com/api/v2";
    },

    /**
     * Get the client ID from connected account credentials
     *
     * @returns {string} The client ID
     */
    _clientId() {
      return this.$auth.client_id;
    },

    /**
     * Get the client secret from connected account credentials
     *
     * @returns {string} The client secret
     */
    _clientSecret() {
      return this.$auth.client_secret;
    },

    /**
     * Fetch a new access token using client credentials
     *
     * @param {Object} [opts] - Request options
     * @param {Object} [opts.$] - Pipedream step context
     * @returns {Promise<string>} The access token
     */
    async getAccessToken({ $ = this } = {}) {
      const res = await axios($, {
        url: `${this._baseUrl()}/oauth/token`,
        method: "POST",
        data: {
          client_id: this._clientId(),
          client_secret: this._clientSecret(),
        },
      });
      const token = res.token ?? res.access_token;
      if (!token) {
        throw new Error(`No token in auth response: ${JSON.stringify(res)}`);
      }
      return token;
    },
    /**
     * Get default headers for API requests
     *
     * @param {Object} [opts] - Request options
     * @param {Object} [opts.$] - Pipedream step context
     * @returns {Object} Headers object with Authorization
     */
    async _headers({ $ = this } = {}) {
      const token = await this.getAccessToken({ $ });
      return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    },
    /**
     * Make an authenticated HTTP request to the Stadium API
     *
     * @param {Object} opts - Request options
     * @param {string} opts.path - API endpoint path
     * @param {string} [opts.method=GET] - HTTP method
     * @param {Object} [opts.params] - Query parameters
     * @param {Object} [opts.data] - Request body data
     * @param {Object} [opts.headers] - Additional headers
     * @param {Object} [opts.$] - Pipedream step context
     * @returns {Object} API response
     */
    async _makeRequest({
      $ = this, path, method = "GET", params, data, headers,
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: {
          ...(await this._headers({ $ })),
          ...headers,
        },
        params,
        data,
      });
    },
    /**
     * Get the current user's profile including wallet balance
     *
     * @param {Object} [opts] - Additional request options
     * @returns {Object} User profile data
     */
    async getUserProfile(opts = {}) {
      return this._makeRequest({
        path: "/users/me",
        ...opts,
      });
    },
    /**
     * Get all stores for the current user
     *
     * @param {Object} [opts] - Additional request options
     * @returns {Object} Object containing stores array
     */
    async listStores(opts = {}) {
      return this._makeRequest({
        path: "/stores",
        ...opts,
      });
    },
    /**
     * Get all products for a store
     *
     * @param {Object} opts - Request options
     * @param {string} opts.storeNumber - The store number
     * @param {number} [opts.page=1] - Page number
     * @param {number} [opts.perPage=25] - Items per page
     * @param {string} [opts.sortBy] - Sort order (e.g., `price:asc`)
     * @param {string} [opts.countryCode] - 2-digit ISO country code
     * @param {string} [opts.color] - Filter by color
     * @param {string} [opts.size] - Filter by size
     * @param {boolean} [opts.onlyInactiveProducts] - Filter inactive products only
     * @param {boolean} [opts.includeInactiveProducts] - Include inactive products
     * @param {boolean} [opts.withOutOfStock] - Include out of stock products
     * @returns {Object} Object containing meta and products array
     */
    async getStoreProducts({
      storeNumber, page, perPage, sortBy, countryCode, color, size,
      onlyInactiveProducts, includeInactiveProducts, withOutOfStock, ...opts
    }) {
      return this._makeRequest({
        path: `/stores/${storeNumber}/products`,
        params: {
          page,
          per_page: perPage,
          sort_by: sortBy,
          country_code: countryCode,
          color,
          size,
          only_inactive_products: onlyInactiveProducts,
          include_inactive_products: includeInactiveProducts,
          with_out_of_stock: withOutOfStock,
        },
        ...opts,
      });
    },
    /**
     * Send points to recipients
     *
     * @param {Object} opts - Request options
     * @param {Object} opts.data - Send points request body
     * @returns {Object} Send points response with order details
     */
    async sendPoints(opts = {}) {
      return this._makeRequest({
        path: "/send_points",
        method: "POST",
        ...opts,
      });
    },
    /**
     * Create a new order
     *
     * @param {Object} opts - Request options
     * @param {Object} opts.data - Order data including store_number, country_iso, address, products
     * @returns {Object} Created order details
     */
    async createOrder(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        method: "POST",
        ...opts,
      });
    },
    /**
     * Checkout a placed order
     *
     * @param {Object} opts - Request options
     * @param {string} opts.orderNumber - The order number
     * @param {string} opts.paymentMethod - Payment method
     * @returns {Object} Checkout response
     */
    async checkoutOrder({
      orderNumber, paymentMethod, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderNumber}/checkout`,
        method: "POST",
        params: {
          payment_method: paymentMethod,
        },
        ...opts,
      });
    },
    /**
     * Get details for a placed order
     *
     * @param {Object} opts - Request options
     * @param {string} opts.orderNumber - The order number
     * @returns {Object} Order details
     */
    async getOrderDetails({
      orderNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderNumber}`,
        ...opts,
      });
    },
    /**
     * Get shipment status and details for a placed order
     *
     * @param {Object} opts - Request options
     * @param {string} opts.orderNumber - The order number
     * @returns {Object} Shipment details
     */
    async getShipmentStatus({
      orderNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderNumber}/shipment_status`,
        ...opts,
      });
    },
    /**
     * Create an automation order
     *
     * @param {Object} opts - Request options
     * @param {string} opts.apiKey - API key for the webhook automation
     * @param {Object} opts.data - Automation order data
     * @returns {Object} Automation order response
     */
    async createAutomationOrder({
      apiKey, ...opts
    }) {
      return this._makeRequest({
        path: "/automations/orders",
        method: "POST",
        headers: {
          api_key: apiKey,
        },
        ...opts,
      });
    },
    /**
     * Check status of an automation order
     *
     * @param {Object} opts - Request options
     * @param {string} opts.apiKey - API key for the webhook automation
     * @param {Object} opts.data - Object containing order_identifier
     * @returns {Object} Order status response
     */
    async checkAutomationOrderStatus({
      apiKey, ...opts
    }) {
      return this._makeRequest({
        path: "/automations/order_status",
        method: "POST",
        headers: {
          api_key: apiKey,
        },
        ...opts,
      });
    },
  },
};
