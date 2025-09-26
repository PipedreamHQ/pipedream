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
          label: (`${firstName || ""} ${lastName || ""}`).trim(),
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
    dealSource: {
      type: "string",
      label: "Source",
      description: "Source of the new deal",
      async options({ page }) {
        const { data } = await this.listDealSources({
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
    company: {
      type: "string",
      label: "Company",
      description: "Identifier of a company",
      async options({ page }) {
        const { data } = await this.listCompanies({
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
    businessType: {
      type: "string",
      label: "Business Type",
      description: "Business type of the company",
      optional: true,
      async options({ page }) {
        const { data } = await this.listBusinessTypes({
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
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    iban: {
      type: "string",
      label: "IBAN",
      description: "IBAN of the contact",
      optional: true,
    },
    bic: {
      type: "string",
      label: "BIC",
      description: "BIC of the contact",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the contact. Example: `en`",
      optional: true,
    },
    remarks: {
      type: "string",
      label: "Remarks",
      description: "Remarks about the contact",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags of the contact",
      optional: true,
    },
    marketingMailsConsent: {
      type: "boolean",
      label: "Marketing Mails Consent",
      description: "Whether the contact has consented to receive marketing emails",
      optional: true,
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
    getContact(args = {}) {
      return this._makeRequest({
        path: "/contacts.info",
        ...args,
      });
    },
    getCompany(args = {}) {
      return this._makeRequest({
        path: "/companies.info",
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
    listCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies.list",
        ...args,
      });
    },
    listBusinessTypes(args = {}) {
      return this._makeRequest({
        path: "/businessTypes.list",
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
    listDealSources(args = {}) {
      return this._makeRequest({
        path: "/dealSources.list",
        ...args,
      });
    },
    updateContact(args = {}) {
      return this._makeRequest({
        path: "/contacts.update",
        ...args,
      });
    },
    updateCompany(args = {}) {
      return this._makeRequest({
        path: "/companies.update",
        ...args,
      });
    },
  },
};
