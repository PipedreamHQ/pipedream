import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wati",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The Id of the contact.",
      async options({ page }) {
        const { result } = await this.listContacts({
          params: {
            pageSize: page + 1,
          },
        });

        return result.map(({ wAid }) => wAid);
      },
    },
    whatsappNumber: {
      type: "string",
      label: "WhatsApp Number",
      description: "Your WhatsApp number with country code.",
    },
    customParams: {
      type: "object",
      label: "Custom Params",
      description: "An object with contact's custom fields.",
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "The name of template.",
      async options({ page }) {
        const { messageTemplates: data } = await this.listTemplates({
          params: {
            pageSize: page + 1,
          },
        });

        return data.map(({ elementName }) => elementName);
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_endpoint}/api/v1`;
    },
    _headers() {
      return {
        Authorization: `${this.$auth.access_token}`,
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
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listContactMessages({
      whatsappNumber, ...opts
    }) {
      return this._makeRequest({
        path: `/getMessages/${whatsappNumber}`,
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/getMessageTemplates",
        ...opts,
      });
    },
    addContact({
      whatsappNumber, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/addContact/${whatsappNumber}`,
        ...opts,
      });
    },
    sendTemplateMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sendTemplateMessage",
        ...opts,
      });
    },
    updateContactAttributes({
      whatsappNumber, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/updateContactAttributes/${whatsappNumber}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, itemsField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.pageNumber = ++page;
        const response = await fn({
          params,
          ...opts,
        });

        let data = response;

        for (const field of itemsField) {
          data = data[field];
        }

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
