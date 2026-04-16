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
          params: {
            page: page + 1,
          },
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
      async options({
        query, page,
      }) {
        const params = {
          page: page + 1,
          order: "desc",
        };
        const { contacts } = query
          ? await this.searchContacts({
            params: {
              ...params,
              email: query,
            },
          })
          : await this.listContacts({
            params,
          });

        return contacts.map((contact) => {
          const value = contact.id;
          const label =
            `${contact.first_name || ""} ${contact.last_name || ""} ${contact.emails[0]?.value || ""
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
    from: {
      type: "string",
      label: "From",
      description: "The start date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21)",
      optional: true,
    },
    to: {
      type: "string",
      label: "To",
      description: "The end date for record retrieval, in ISO 8601 format (e.g., 2016-09-24T00:00:05.000Z or 2016-09-21)",
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "The order of the results",
      options: [
        {
          label: "Ascending",
          value: "asc",
        },
        {
          label: "Descending",
          value: "desc",
        },
      ],
      default: "desc",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
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
    async listCalls(args = {}) {
      return this._makeRequest({
        path: "calls",
        ...args,
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
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async searchContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async retrieveTranscription({
      $, callId, ...args
    }) {
      return this._makeRequest({
        path: `calls/${callId}/transcription`,
        $,
        ...args,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          per_page: 50,
        },
      };
      let total, count = 0;
      do {
        const response = await fn(args);
        const items = response[resourceKey];
        total = items?.length;
        if (!total) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.page++;
      } while (total === args.params.per_page);
    },
  },
};
