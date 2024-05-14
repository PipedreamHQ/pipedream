import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "thoughtly",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact.",
      async options({ page }) {
        const { data: { contacts } } = await this.listContacts({
          params: {
            page,
          },
        });

        return contacts.map(({
          id: value, name, phone_number,
        }) => ({
          label: `${name || phone_number}`,
          value,
        }));
      },
    },
    interviewId: {
      type: "string",
      label: "Interview ID",
      description: "The ID of the interview.",
      async options({ page }) {
        const { data: { interviews } } = await this.listInterviews({
          params: {
            page,
          },
        });

        return interviews.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.thought.ly";
    },
    _headers() {
      return {
        "x-api-token": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/create",
        ...opts,
      });
    },
    callContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact/call",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contact",
        ...opts,
      });
    },
    listInterviews(opts = {}) {
      return this._makeRequest({
        path: "/interview",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks/subscribe",
        ...opts,
      });
    },
    deleteHook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/webhooks/unsubscribe",
        ...opts,
      });
    },
  },
};
