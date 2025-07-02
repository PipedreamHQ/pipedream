import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orderspace",
  propDefinitions: {
    paymentTermId: {
      type: "string",
      label: "Payment Term ID",
      description: "The ID of the payment term to use for the customer",
      optional: true,
      async options() {
        const { payment_terms = [] } = await this.listPaymentTerms();
        return payment_terms.map((term) => ({
          label: term.name,
          value: term.id,
        }));
      },
    },
    customerGroupId: {
      type: "string",
      label: "Customer Group ID",
      description: "The ID of the customer group to use for the customer",
      optional: true,
      async options() {
        const { customer_groups = [] } = await this.listCustomerGroups();
        return customer_groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    priceListId: {
      type: "string",
      label: "Price List ID",
      description: "The ID of the price list to use for the customer",
      optional: true,
      async options() {
        const { price_lists = [] } = await this.listPriceLists();
        return price_lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.orderspace.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    listPaymentTerms(opts = {}) {
      return this._makeRequest({
        path: "/payment_terms",
        ...opts,
      });
    },
    listCustomerGroups(opts = {}) {
      return this._makeRequest({
        path: "/customer_groups",
        ...opts,
      });
    },
    listPriceLists(opts = {}) {
      return this._makeRequest({
        path: "/price_lists",
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    createOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/orders",
        ...opts,
      });
    },
    createDispatch(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dispatches",
        ...opts,
      });
    },
    updateInventoryLevel(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/inventory_levels",
        ...opts,
      });
    },
  },
};
