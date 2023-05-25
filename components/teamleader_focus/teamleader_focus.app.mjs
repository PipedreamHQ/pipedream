import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamleader_focus",
  propDefinitions: {
    contact: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact lead",
      async options({ page }) {
        const { data } = await this.listContacts({
          data: {
            page: {
              number: page + 1,
            },
          },
        });
        return data?.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          value: id,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "User responsible for the new deal",
      async options({ page }) {
        const { data } = await this.listUsers({
          data: {
            page: {
              number: page + 1,
            },
          },
        });
        return data?.map(({
          id, first_name: firstName, last_name: lastName,
        }) => ({
          value: id,
          label: `${firstName} ${lastName}`,
        })) || [];
      },
    },
    dealPhase: {
      type: "string",
      label: "Phase",
      description: "Phase of the new deal",
      async options({ page }) {
        const { data } = await this.listDealPhases({
          data: {
            page: {
              number: page + 1,
            },
          },
        });
        return data?.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        })) || [];
      },
    },
    invoice: {
      type: "string",
      label: "Invoice",
      description: "Invoice to update",
      async options({ page }) {
        const { data } = await this.listInvoices({
          data: {
            page: {
              number: page + 1,
            },
          },
        });
        return data?.map(({ id }) => id) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.focus.teamleader.eu";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "POST",
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        method,
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks.register",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks.unregister",
        ...args,
      });
    },
    getInvoice(args = {}) {
      return this._makeRequest({
        path: "/invoices.info",
        ...args,
      });
    },
    getDeal(args = {}) {
      return this._makeRequest({
        path: "/deals.info",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts.list",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals.list",
        ...args,
      });
    },
    listDealPhases(args = {}) {
      return this._makeRequest({
        path: "/dealPhases.list",
        ...args,
      });
    },
    listInvoices(args = {}) {
      return this._makeRequest({
        path: "/invoices.list",
        ...args,
      });
    },
    listPaymentTerms(args = {}) {
      return this._makeRequest({
        path: "/paymentTerms.list",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users.list",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts.add",
        ...args,
      });
    },
    createDeal(args = {}) {
      return this._makeRequest({
        path: "/deals.create",
        ...args,
      });
    },
    updateInvoice(args = {}) {
      return this._makeRequest({
        path: "/invoices.update",
        ...args,
      });
    },
  },
};
