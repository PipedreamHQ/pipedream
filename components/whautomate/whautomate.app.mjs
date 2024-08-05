import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whautomate",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact",
      async options({ page }) {
        const data = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactTags: {
      type: "string[]",
      label: "Contact Tags",
      description: "An array of contact tags.",
      async options({ page }) {
        const data = await this.listContactTags({
          params: {
            page: page + 1,
          },
        });

        return data.map(({ name }) => name);
      },
    },
    locationId: {
      type: "string",
      label: "Location Id",
      description: "The location id of the contact",
      async options({ page }) {
        const data = await this.listLocations({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
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
      return "https://api.whautomate.com/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
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
        path: "/contacts",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    getContact(contactId) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listContactTags(opts = {}) {
      return this._makeRequest({
        path: "/contactTags",
        ...opts,
      });
    },
    listLocations(opts = {}) {
      return this._makeRequest({
        path: "/locations",
        ...opts,
      });
    },
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    sendWhatsAppMessageTemplate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/whatsapp/sendtemplate",
        ...opts,
      });
    },
  },
};
