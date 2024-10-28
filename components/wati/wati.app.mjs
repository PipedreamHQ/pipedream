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
        const { result: { items } } = await this.listContacts({
          data: {
            pageSize: 100,
            pageNumber: page,
          },
        });

        return items.map(({ wAid }) => wAid);
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
        method: "POST",
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
      fn, itemsField, optsField, maxResults = null, data = {}, params = {}, ...otherOpts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      const opts = {
        data,
        params,
        ...otherOpts,
      };

      opts[optsField].pageSize = 100;

      do {
        opts[optsField].pageNumber = page++;
        const response = await fn(opts);
        const items = response[itemsField].items;

        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
