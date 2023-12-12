import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "printavo",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "The id of the customer",
      async options({ page }) {
        const { data } = await this.listCustomers(
          page + 1,
        );
        return {
          options: data.map((customer) => ({
            label: `${customer.first_name} ${customer.last_name}`,
            value: customer.id,
          })),
        };
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the customer",
      optional: true,
    },
    extraNotes: {
      type: "string",
      label: "Extra Notes",
      description: "Extra notes about the customer",
      optional: true,
    },
    taxExempt: {
      type: "boolean",
      label: "Tax Exempt",
      description: "Whether the customer is tax exempt",
      optional: true,
    },
    taxResaleNum: {
      type: "string",
      label: "Tax Resale Number",
      description: "The tax resale number of the customer",
      optional: true,
    },
    salesTax: {
      type: "integer",
      label: "Sales Tax",
      description: "Sales tax as a percentage. Ex: `8.8`",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://www.printavo.com/api/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getEmail() {
      return this.$auth.email;
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          token: this._getApiToken(),
          email: this._getEmail(),
        },
      };
    },
    async listCustomers(page, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/customers",
        params: {
          page,
        },
      }));
    },
    async createCustomer(data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: "/customers",
        data,
      }));
    },
    async updateCustomer(customerId, data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "PUT",
        path: `/customers/${customerId}`,
        data,
      }));
    },
    async deleteCustomer(customerId, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "DELETE",
        path: `/customers/${customerId}`,
      }));
    },
    async searchCustomers(params, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "/customers/search",
        params,
      }));
    },
  },
};
