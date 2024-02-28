import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "keysender",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product for the order",
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the product for the order",
    },
    recipientInfo: {
      type: "object",
      label: "Recipient Information",
      description: "The information of the recipient for the order",
    },
    orderType: {
      type: "string",
      label: "Order Type",
      description: "The type of the order",
      optional: true,
    },
    priorityStatus: {
      type: "string",
      label: "Priority Status",
      description: "The priority status of the order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "http://panel.keysender.co.uk/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "get",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
  },
};
