import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smartroutes",
  propDefinitions: {
    orderDetails: {
      type: "object",
      label: "Order Details",
      description: "All necessary information like destination, order contents, and sender details.",
      optional: false,
    },
    userInfo: {
      type: "object",
      label: "User Information",
      description: "Relevant user data.",
      optional: false,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.smartroutes.io";
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createOrder(orderDetails, userInfo) {
      return this._makeRequest({
        method: "post",
        path: "/orders",
        data: {
          orderDetails,
          userInfo,
        },
      });
    },
  },
};
