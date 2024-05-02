import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "chaser",
  propDefinitions: {
    customerExternalId: {
      type: "string",
      label: "Customer External ID",
      description: "Select a customer, or provide a customer external ID.",
      async options({ page }) {
        const { data } = await this.listCustomers({
          page,
          limit: 100,
        });
        return data?.map((customer) => ({
          label:
            `${customer.contact_first_name ?? ""} ${
              customer.contact_last_name ?? ""
            }`.trim() ||
            customer.contact_email_address ||
            customer.external_id,
          value: customer.external_id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.host}/v1`;
    },
    async _makeRequest({
      $ = this, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        auth: {
          username: `${this.$auth.key}`,
          password: `${this.$auth.secret}`,
        },
      });
    },
    async listCustomers(args) {
      return this._makeRequest({
        url: "/customers",
        ...args,
      });
    },
    async createCustomer(args) {
      return this._makeRequest({
        method: "POST",
        url: "/customers",
        ...args,
      });
    },
    async createInvoice(args) {
      return this._makeRequest({
        method: "POST",
        url: "/invoices",
        ...args,
      });
    },
  },
};
