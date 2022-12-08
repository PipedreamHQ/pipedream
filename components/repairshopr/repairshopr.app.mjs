import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "repairshopr",
  propDefinitions: {
    businessName: {
      type: "string",
      label: "Business Name",
      description: "The business name of the customer.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the customer.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the customer.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The second address of the customer.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the customer.",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the customer.",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer.",
      async options({ page }) {
        const { customers } = await this.listCustomers(page + 1);
        return customers.map((customer) => ({
          label: customer.business_name || `${customer.firstname} ${customer.lastname}`,
          value: customer.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return `${this._getSubdomain()}/api/v1`;
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getSubdomain() {
      return this.$auth.subdomain;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async createCustomer(data, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/customers",
          method: "POST",
          data,
        },
        ctx,
      );
    },
    async createLead(data, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/leads",
          method: "POST",
          data,
        },
        ctx,
      );
    },
    async createTicket(data, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/tickets",
          method: "POST",
          data,
        },
        ctx,
      );
    },
    async listCustomers(page, params = {}, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/customers",
          method: "GET",
          params: {
            page,
            ...params,
          },
        },
        ctx,
      );
    },
    async listTickets(page, params = {}, ctx = this) {
      return this._makeHttpRequest(
        {
          path: "/tickets",
          method: "GET",
          params: {
            page,
            ...params,
          },
        },
        ctx,
      );
    },
  },
};
