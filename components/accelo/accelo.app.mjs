import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "accelo",
  propDefinitions: {
    companyId: {
      label: "Company ID",
      description: "The company ID",
      type: "string",
      async options() {
        const { response: companies } = await this.getCompanies();

        return companies.map((company) => ({
          value: company.id,
          label: company.name,
        }));
      },
    },
    contactId: {
      label: "Contact ID",
      description: "The contact ID",
      type: "string",
      async options({ page }) {
        const { response: contacts } = await this.getContacts({
          params: {
            _page: page,
          },
        });

        return contacts.map((contact) => ({
          value: contact.id,
          label: `${contact.firstname} ${contact.surname}`,
        }));
      },
    },
    affiliationId: {
      label: "Affiliation ID",
      description: "The affiliation ID",
      type: "string",
      async options({ page }) {
        const { response: affiliations } = await this.getAffiliations({
          params: {
            _page: page,
          },
        });

        return affiliations.map((affiliation) => ({
          value: affiliation.id,
          label: affiliation.email,
        }));
      },
    },
    requestTypeId: {
      label: "Request Type ID",
      description: "The request type ID",
      type: "string",
      async options({ page }) {
        const { response: { request_types } } = await this.getRequestTypes({
          params: {
            _page: page,
            show_active_only: 1,
          },
        });

        return request_types.map((requestType) => ({
          value: requestType.id,
          label: requestType.title,
        }));
      },
    },
    prospectTypeId: {
      label: "Prospect Type ID",
      description: "The prospect type ID",
      type: "string",
      async options({ page }) {
        const { response: prospectTypes } = await this.getProspectTypes({
          params: {
            _page: page,
            show_active_only: 1,
          },
        });

        return prospectTypes.map((prospectType) => ({
          value: prospectType.id,
          label: prospectType.title,
        }));
      },
    },
  },
  methods: {
    _hostname() {
      return this.$auth.hostname;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return `https://${this._hostname()}.api.accelo.com/api/v0`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async createWebhook({ ...args }) {
      return this._makeRequest({
        path: "/webhooks/subscriptions",
        method: "post",
        ...args,
      });
    },
    async removeWebhook(webhookId) {
      return this._makeRequest({
        path: `/webhooks/subscriptions/${webhookId}`,
        method: "delete",
      });
    },
    async getCompanies(args = {}) {
      return this._makeRequest({
        path: "/companies",
        ...args,
      });
    },
    async getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async getAffiliations(args = {}) {
      return this._makeRequest({
        path: "/affiliations",
        ...args,
      });
    },
    async getRequestTypes(args = {}) {
      return this._makeRequest({
        path: "/requests/types",
        ...args,
      });
    },
    async getProspectTypes(args = {}) {
      return this._makeRequest({
        path: "/prospects/types",
        ...args,
      });
    },
    async getTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    async getTask({
      taskId, ...args
    }) {
      return this._makeRequest({
        path: `/tasks/${taskId}`,
        ...args,
      });
    },
    async getRequests(args = {}) {
      return this._makeRequest({
        path: "/requests",
        ...args,
      });
    },
    async getRequest({
      requestId, ...args
    }) {
      return this._makeRequest({
        path: `/requests/${requestId}`,
        ...args,
      });
    },
    async createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "post",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        method: "put",
        ...args,
      });
    },
    async createRequest(args = {}) {
      return this._makeRequest({
        path: "/requests",
        method: "post",
        ...args,
      });
    },
    async createProspect(args = {}) {
      return this._makeRequest({
        path: "/prospects",
        method: "post",
        ...args,
      });
    },
  },
};
