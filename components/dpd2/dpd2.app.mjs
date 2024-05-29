import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dpd2",
  propDefinitions: {
    storefrontId: {
      type: "string",
      label: "Storefront ID",
      description: "The ID of a storefront",
      optional: true,
      async options() {
        const storefronts = await this.listStorefronts();
        return storefronts?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product being purchased",
      optional: true,
      async options({ storefrontId }) {
        const products = await this.listProducts({
          params: {
            storefront_id: storefrontId,
          },
        });
        return products?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of a customer",
      optional: true,
      async options() {
        const customers = await this.listCustomers();
        return customers?.map(({
          id: value, firstname, lastname,
        }) => ({
          label: (`${firstname} ${lastname}`).trim(),
          value,
        })) || [];
      },
    },
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of a subscriber",
      optional: true,
      async options({ storefrontId }) {
        if (!storefrontId) {
          return [];
        }
        const subscribers = await this.listSubscribers({
          storefrontId,
        });
        return subscribers?.map(({
          id: value, username: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter purchases by status",
      optional: true,
      options: constants.PURCHASE_STATUSES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getdpd.com/v2";
    },
    _auth() {
      return {
        username: this.$auth.api_username,
        password: this.$auth.api_password,
      };
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        method = "GET",
        ...otherOpts
      } = opts;
      try {
        return await axios($, {
          ...otherOpts,
          method,
          url: `${this._baseUrl()}${path}`,
          auth: this._auth(),
        });
      } catch (e) {
        if (method === "GET") {
          console.log(`No ${path.split("/").pop()} found`);
        } else {
          throw new ConfigurationError(JSON.stringify(e));
        }
      }
    },
    listStorefronts(opts = {}) {
      return this._makeRequest({
        path: "/storefronts",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products",
        ...opts,
      });
    },
    listPurchases(opts = {}) {
      return this._makeRequest({
        path: "/purchases",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listSubscribers({
      storefrontId, ...opts
    }) {
      return this._makeRequest({
        path: `/storefronts/${storefrontId}/subscribers`,
        ...opts,
      });
    },
  },
};
