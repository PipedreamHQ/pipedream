import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loyverse",
  propDefinitions: {
    customerAmount: {
      type: "integer",
      label: "Max Amount",
      description: "The maximum amount of customers you want to retrieve, starting from the most recent customers. If you provide a `Customer ID`, this will be ignored.",
      optional: true,
      default: 50,
      min: 1,
      max: 250,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer or provide a customer ID to retrieve information for. You can leave this empty to retrieve a list of customers instead.",
      optional: true,
      async options({ prevContext: { lastCursor } }) {
        return this._paginatedOptions({
          fn: "listCustomers",
          name: "customers",
          map: ({
            id, name, email,
          }) => ({
            label: `${name} (${email})`,
            value: id,
          }),
          lastCursor,
        });
      },
    },
    paymentTypeId: {
      type: "string",
      label: "Payment Type ID",
      description: "Select a payment type or provide a payment type ID.",
      async options({ prevContext: { lastCursor } }) {
        return this._paginatedOptions({
          fn: "listPaymentTypes",
          name: "payment_types",
          map: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          lastCursor,
        });
      },
    },
    storeId: {
      type: "string",
      label: "Store ID",
      description: "Select a store or provide a store ID.",
      async options({ prevContext: { lastCursor } }) {
        return this._paginatedOptions({
          fn: "listStores",
          name: "stores",
          map: ({
            id, name,
          }) => ({
            label: name,
            value: id,
          }),
          lastCursor,
        });
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "Select an employee or provide an employee ID.",
      optional: true,
      async options({ prevContext: { lastCursor } }) {
        return this._paginatedOptions({
          fn: "listEmployees",
          name: "employees",
          map: ({
            id, name, email,
          }) => ({
            label: `${name} (${email})`,
            value: id,
          }),
          lastCursor,
        });
      },
    },
    itemVariantId: {
      type: "string",
      label: "Item Variant ID",
      description: "Select an item variant or provide an item variant ID.",
      async options({ prevContext: { lastCursor } }) {
        return this._paginatedOptions({
          fn: "listItemVariants",
          name: "variants",
          map: ({
            variant_id: id, sku,
          }) => ({
            label: `SKU ${sku}`,
            value: id,
          }),
          lastCursor,
        });
      },
    },
  },
  methods: {
    async _paginatedOptions({
      fn, name, map, lastCursor,
    }) {
      const {
        [name]: items, cursor,
      } = await this[fn]({
        params: {
          cursor: lastCursor,
        },
      });
      const options = items.map(map);
      return {
        options,
        context: {
          lastCursor: cursor,
        },
      };
    },
    _baseUrl() {
      return "https://api.loyverse.com/v1.0";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createReceipt(args) {
      return this._makeRequest({
        method: "POST",
        url: "/receipts",
        ...args,
      });
    },
    async batchUpdateInventoryLevels(args) {
      return this._makeRequest({
        method: "POST",
        url: "/inventory",
        ...args,
      });
    },
    async getCustomerDetails({
      customerId, ...args
    }) {
      return this._makeRequest({
        url: `/customers/${customerId}`,
        ...args,
      });
    },
    async listCustomers(args) {
      return this._makeRequest({
        url: "/customers",
        ...args,
      });
    },
    async listStores(args) {
      return this._makeRequest({
        url: "/stores",
        ...args,
      });
    },
    async listEmployees(args) {
      return this._makeRequest({
        url: "/employees",
        ...args,
      });
    },
    async listPaymentTypes(args) {
      return this._makeRequest({
        url: "/payment_types",
        ...args,
      });
    },
    async listItemVariants(args) {
      return this._makeRequest({
        url: "/variants",
        ...args,
      });
    },
    async createWebhook(args) {
      return this._makeRequest({
        method: "POST",
        url: "/webhooks",
        ...args,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        url: `/webhooks/${id}`,
      });
    },
  },
};
