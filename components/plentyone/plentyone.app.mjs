import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "plentyone",
  propDefinitions: {
    warehouseId: {
      type: "integer",
      label: "Warehouse ID",
      description: "The ID of the warehouse.",
      async options() {
        const data = await this.getWarehouses();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact to retrieve orders for.",
      async options({ page }) {
        const { entries } = await this.getContacts({
          params: {
            page: page + 1,
          },
        });

        return entries.map(({
          plentyId: value, title, firstName, lastName,
        }) => ({
          label: `${title} ${firstName} ${lastName}`,
          value,
        }));
      },
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "ID of the order to retrieve documents for.",
      async options({ page }) {
        const { entries } = await this.getOrders({
          params: {
            page: page + 1,
          },
        });

        return entries.map(({ id }) => ({
          label: id,
          value: id,
        }));
      },
    },
    countryId: {
      type: "integer",
      label: "Country ID",
      description: "Filter that restricts the search result to orders with a specific delivery or invoice country.",
      async options({ page }) {
        const data = await this.getCountries({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    orderItemId: {
      type: "string",
      label: "Order Item ID",
      description: "ID of the order item to delete.",
      async options({
        page, orderId,
      }) {
        const { entries } = await this.getOrderItems({
          orderId,
          params: {
            page: page + 1,
          },
        });

        return entries.map(({
          itemVariationId: value, orderItemName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    statusId: {
      type: "integer",
      label: "Status ID",
      description: "The ID of the order status.",
      async options({ page }) {
        const { entries } = await this.getOrderStatuses({
          params: {
            page: page + 1,
          },
        });

        return entries.map(({
          statusId: value, names: { en: label },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _baseUrl() {
      return `https://p${this.$auth.id}.my.plentysystems.com/rest`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    addOrderNote(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/comments",
        ...opts,
      });
    },
    getWarehouses(opts = {}) {
      return this._makeRequest({
        path: "/stockmanagement/warehouses",
        ...opts,
      });
    },
    getOrders(opts = {}) {
      return this._makeRequest({
        path: "/orders",
        ...opts,
      });
    },
    getOrder({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}`,
        ...opts,
      });
    },
    getOrderStatuses(opts = {}) {
      return this._makeRequest({
        path: "/orders/statuses",
        ...opts,
      });
    },
    getContacts(opts = {}) {
      return this._makeRequest({
        path: "/accounts/contacts",
        ...opts,
      });
    },
    getOrderDocuments(opts = {}) {
      return this._makeRequest({
        path: "/orders/documents/find",
        ...opts,
      });
    },
    getCountries(opts = {}) {
      return this._makeRequest({
        path: "/orders/shipping/countries",
        ...opts,
      });
    },
    getReturns({
      orderId, ...opts
    }) {
      return this._makeRequest({
        path: `/orders/${orderId}/shipping/returns`,
        ...opts,
      });
    },
    getOrderItems({
      orderId, ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/orders/${orderId}/items`,
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
  },
};
