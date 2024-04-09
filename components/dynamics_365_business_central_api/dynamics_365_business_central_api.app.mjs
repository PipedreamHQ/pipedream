import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dynamics_365_business_central_api",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The identifier of a company",
      async options() {
        const { value } = await this.listCompanies();
        return value?.map(({
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
      description: "The identifier of a customer",
      async options({ companyId }) {
        const { value } = await this.listCustomers({
          companyId,
        });
        return value?.map(({
          id: value, displayName: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    salesOrderId: {
      type: "string",
      label: "Sales Order ID",
      description: "The identifier of a sales order",
      async options({ companyId }) {
        const { value } = await this.listSalesOrders({
          companyId,
        });
        return value?.map(({
          id: value, number, customerName, orderDate,
        }) => ({
          value,
          label: `${number} - ${orderDate} - ${customerName}`,
        })) || [];
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Street Address",
      description: "Street address of the customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the customer",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the customer",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Postal code of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the customer",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/beta/financials";
    },
    _headers(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getSalesOrder({
      companyId, salesOrderId, ...opts
    }) {
      return this._makeRequest({
        path: `/companies(${companyId})/salesOrders(${salesOrderId})`,
        ...opts,
      });
    },
    getCustomer({
      companyId, customerId, ...opts
    }) {
      return this._makeRequest({
        path: `/companies(${companyId})/customers(${customerId})`,
        ...opts,
      });
    },
    listSalesOrders({
      companyId, ...opts
    }) {
      return this._makeRequest({
        path: `/companies(${companyId})/salesOrders`,
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listCustomers({
      companyId, ...opts
    }) {
      return this._makeRequest({
        path: `/companies(${companyId})/customers`,
        ...opts,
      });
    },
    createCustomer({
      companyId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/companies(${companyId})/customers`,
        ...opts,
      });
    },
    updateCustomer({
      companyId, customerId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/companies(${companyId})/customers(${customerId})`,
        headers: {
          "If-Match": "*",
        },
        ...opts,
      });
    },
  },
};
