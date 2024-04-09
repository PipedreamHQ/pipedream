import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "splynx",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Select a customer to update, or provide a customer ID.",
      async options() {
        const customers = await this.listCustomers();
        return customers?.map(({
          name, id,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    tariffId: {
      type: "string",
      label: "Tariff ID",
      description: "Select a tariff, or provide a tariff ID.",
      async options() {
        const tariffs = await this.listTariffs();
        return tariffs?.map(({
          title, id,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.splynx.app/api/2.0/admin`;
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          Authorization: `Splynx-EA (access_token=${this.$auth.oauth_access_token})`,
        },
      });
    },
    async listCustomers() {
      return this._makeRequest({
        url: "/customers/customer",
      });
    },
    async listTariffs() {
      return this._makeRequest({
        url: "/tariffs/internet",
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers/customer",
        ...args,
      });
    },
    async createInternetService({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/customers/customer/${customerId}/internet-services`,
        ...args,
      });
    },
    async updateCustomer({
      customerId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/customers/customer/${customerId}`,
        ...args,
      });
    },
  },
};
