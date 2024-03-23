import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "loyverse",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer or provide a customer ID to retrieve information for. You can leave this empty to retrieve a list of customers instead.",
      optional: true,
      async options({ page }) {
        const customers = await this.listCustomers({
          params: {
            cursor: page,
          },
        });
        return customers.map(({
          id, name, email,
        }) => ({
          label: `${name} (${email})`,
          value: id,
        }));
      },
    },
    storeId: {
      type: "string",
      label: "Store ID",
      description: "Select a store or provide a store ID.",
      async options({ page }) {
        const stores = await this.listStores({
          params: {
            cursor: page,
          },
        });
        return stores.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    employeeId: {
      type: "string",
      label: "Employee ID",
      description: "Select an employee or provide an employee ID.",
      optional: true,
      async options({ page }) {
        const employees = await this.listEmployees({
          params: {
            cursor: page,
          },
        });
        return employees.map(({
          id, name, email,
        }) => ({
          label: `${name} (${email})`,
          value: id,
        }));
      },
    },
    itemVariantId: {
      type: "string",
      label: "Item Variant ID",
      description: "Select an item variant or provide an item variant ID.",
      async options({ page }) {
        const variants = await this.listItemVariants({
          params: {
            cursor: page,
          },
        });
        return variants.map(({
          variant_id: value, sku,
        }) => ({
          label: `SKU ${sku}`,
          value,
        }));
      },
    },
    paymentTypeId: {
      type: "string",
      label: "Payment Type ID",
      description: "Select a payment type or provide a payment type ID.",
      async options({ page }) {
        const paymentTypes = await this.listPaymentTypes({
          params: {
            cursor: page,
          },
        });
        return paymentTypes.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    customerAmount: {
      type: "integer",
      label: "Max Amount",
      description: "The maximum amount of customers you want to retrieve, starting from the most recent customers. If you provide a `Customer ID`, this will be ignored.",
      optional: true,
      default: 50,
      min: 1,
      max: 250,
    },
  },
  methods: {
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
    async createReceipt({
      storeId, itemIds = [], paymentDetails, customerId,
    }) {
      return this._makeRequest({
        method: "POST",
        url: "/receipts",
        data: {
          store_id: storeId,
          line_items: itemIds.map((id) => ({
            variant_id: id,
          })),
          payments: paymentDetails
            ? [
              paymentDetails,
            ]
            : [],
          customer_id: customerId,
        },
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
      const response = await this._makeRequest({
        url: "/customers",
        ...args,
      });
      return response.customers;
    },
    async listStores(args) {
      const response = await this._makeRequest({
        url: "/stores",
        ...args,
      });
      return response.stores;
    },
    async listEmployees(args) {
      const response = await this._makeRequest({
        url: "/employees",
        ...args,
      });
      return response.employees;
    },
    async listPaymentTypes(args) {
      const response = await this._makeRequest({
        url: "/payment_types",
        ...args,
      });
      return response.payment_types;
    },
    async listItemVariants(args) {
      const response = await this._makeRequest({
        url: "/variants",
        ...args,
      });
      return response.variants;
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
