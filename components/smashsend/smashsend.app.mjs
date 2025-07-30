import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smashsend",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to update",
      async options({ prevContext }) {
        const params = prevContext?.cursor
          ? {
            cursor: prevContext.cursor,
          }
          : {};
        const { contacts } = await this.listContacts(params);
        const {
          items, cursor,
        } = contacts;
        return {
          options: items?.map(({
            id: value, properties: {
              firstName, lastName, email,
            },
          }) => ({
            label: (firstName || lastName)
              ? (`${firstName} ${lastName}`).trim() + " - " + email
              : email,
            value,
          })) || [],
          context: {
            cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smashsend.com/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
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
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    searchContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/search",
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
    deleteContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, resourceKey, max,
    }) {
      let count = 0;
      do {
        const response = await fn({
          params,
        });
        const {
          cursor, hasMore, items,
        } = response[resourceKey];
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        if (!hasMore) {
          return;
        }
        params.cursor = cursor;
      } while (true);
    },
    async getPaginatedResources(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
