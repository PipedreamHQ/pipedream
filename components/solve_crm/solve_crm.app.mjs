import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "solve_crm",
  propDefinitions: {
    category: {
      type: "string",
      label: "Category",
      description: "Watch for contacts tagged in the specified category",
      async options() {
        const { categories } = await this.listCategories();
        return categories.map((category) => ({
          value: category.id,
          label: category.name,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://secure.solve360.com";
    },
    _headers() {
      const token = `${this.$auth.email}:${this.$auth.api_token}`;
      const encodedToken = Buffer.from(token).toString("base64");
      return {
        Authorization: `Basic ${encodedToken}`,
        Accept: "application/json",
      };
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createHook(args = {}) {
      return this._makeRequest({
        path: "/hooks/",
        method: "POST",
        ...args,
      });
    },
    async deleteHook(hookId, args = {}) {
      return this._makeRequest({
        path: `/hooks/${hookId}/`,
        method: "DELETE",
        ...args,
      });
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    async listCategories(args = {}) {
      return this._makeRequest({
        path: "/contacts/categories/",
        ...args,
      });
    },
    async listOwnership(args = {}) {
      return this._makeRequest({
        path: "/ownership",
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
  },
};
