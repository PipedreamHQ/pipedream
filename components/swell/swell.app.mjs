import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "swell",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The account's email address",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The account's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The account's last name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The account's phone number",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes about the account",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The product's full name or display name",
    },
    price: {
      type: "string",
      label: "Price",
      description: "The price associated with the product",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Whether the product is active",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the product",
      optional: true,
    },
    discontinued: {
      type: "boolean",
      label: "Discontinued",
      description: "Whether the product is discontinued",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "ID of the account that will be updated",
      async options() {
        const { results } = await this.getAccounts();
        return results.map(({
          email, id,
        }) => ({
          label: email,
          value: id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.store_id}:${this.$auth.secret_key}@api.swell.store`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
      });
    },
    async createAccount(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        method: "post",
        ...args,
      });
    },
    async createProduct(args = {}) {
      return this._makeRequest({
        path: "/products",
        method: "post",
        ...args,
      });
    },
    async updateAccount({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}`,
        method: "put",
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
  },
};
