import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "moneybird",
  propDefinitions: {
    contactId: {
      label: "Contact ID",
      description: "The ID of the contact",
      type: "string",
      async options({ page }) {
        const contacts = await this.getContacts({
          params: {
            page: page + 1,
          },
        });

        return contacts.map(({
          id, first_name, last_name, company_name,
        }) => ({
          label: first_name
            ? `${first_name} ${last_name}`
            : company_name,
          value: id,
        }));
      },
    },
    productId: {
      label: "Product ID",
      description: "The ID of the product",
      type: "string",
      async options({ page }) {
        const products = await this.getProducts({
          params: {
            page: page + 1,
          },
        });

        return products.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        }));
      },
    },
    projectId: {
      label: "Project ID",
      description: "The ID of the project",
      type: "string",
      async options({ page }) {
        const projects = await this.getProjects({
          params: {
            page: page + 1,
          },
        });

        return projects.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    _administrationId() {
      return this.$auth.administration_id;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://moneybird.com/api/v2/${this._administrationId()}`;
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createWebhook(data) {
      return this._makeRequest("webhooks", {
        method: "post",
        data,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest(`webhooks/${webhookId}`, {
        method: "delete",
      });
    },
    async getProducts({
      $, params,
    }) {
      return this._makeRequest("products", {
        params,
      }, $);
    },
    async getProjects({
      $, params,
    }) {
      return this._makeRequest("projects", {
        params,
      }, $);
    },
    async getContacts({
      $, params,
    }) {
      return this._makeRequest("contacts", {
        params,
      }, $);
    },
    async createContact({
      $, data,
    }) {
      return this._makeRequest("contacts", {
        method: "post",
        data,
      }, $);
    },
    async createQuote({
      $, data,
    }) {
      return this._makeRequest("estimates", {
        method: "post",
        data,
      }, $);
    },
    async createSaleInvoice({
      $, data,
    }) {
      return this._makeRequest("sales_invoices", {
        method: "post",
        data,
      }, $);
    },
  },
};
