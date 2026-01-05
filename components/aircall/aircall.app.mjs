import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "aircall",
  propDefinitions: {
    call: {
      type: "string",
      label: "Call",
      description: "Select a call",
      async options({ page }) {
        const { calls } = await this.listCalls({
          page,
        });
        return calls.map((call) => ({
          label: call.raw_digits,
          value: call.id,
        }));
      },
    },
    contactId: {
      type: "integer",
      label: "Contact ID",
      description: "Search for a Contact by email. You can also select a listed Contact or provide a custom Contact ID",
      useQuery: true,
      async options({ query }) {
        const { contacts } = query
          ? await this.searchContacts(query)
          : await this.listContacts();

        return contacts.map((contact) => {
          const value = contact.id;
          const label =
            `${contact.first_name || ""} ${contact.last_name || ""} ${
              contact.emails[0]?.value || ""
            }`.trim() || value;
          return {
            label,
            value,
          };
        });
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
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name of the contact",
      optional: true,
    },
    information: {
      type: "string",
      label: "Information",
      description: "Information on the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.aircall.io/v1/";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this._authToken()}`,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET", path, $ = this, ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async createWebhook(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        data,
      });
    },
    async deleteWebhook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${id}`,
      });
    },
    async getCall(id, $) {
      return this._makeRequest({
        path: `calls/${id}`,
        $,
      });
    },
    async listCalls(params = {}, $) {
      return this._makeRequest({
        path: "calls",
        params,
        $,
      });
    },
    async createContact(args) {
      return this._makeRequest({
        path: "contacts",
        method: "POST",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        path: `contacts/${contactId}`,
        method: "POST",
        ...args,
      });
    },
    async listContacts() {
      return this._makeRequest({
        path: "contacts",
        params: {
          order: "desc",
        },
      });
    },
    async searchContacts(email) {
      return this._makeRequest({
        path: "contacts",
        params: {
          email,
          order: "desc",
        },
      });
    },
    async retrieveTranscription({$, callId, ...args}) {
      return this._makeRequest({
        path: `calls/${callId}/transcription`,
        $,
        ...args
      });
    },
  },
};
