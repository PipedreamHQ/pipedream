import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshmarketer",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({
        page, listId,
      }) {
        const { contacts } = await this.listContacts({
          listId,
          params: {
            page,
          },
        });

        return contacts.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    leadSourceId: {
      type: "string",
      label: "Lead Source ID",
      description: "ID of the source where contact came from.",
      async options({ page }) {
        const { lead_sources: data } = await this.listSelectors({
          selector: "lead_sources",
          params: {
            page,
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
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options({ page }) {
        const { lists } = await this.listLists({
          params: {
            page,
          },
        });

        return lists.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "ID of the user to whom the contact has been assigned.",
      async options({ page }) {
        const { users } = await this.listSelectors({
          selector: "owners",
          params: {
            page,
          },
        });

        return users.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    territoryId: {
      type: "string",
      label: "Territory ID",
      description: "ID of the territory that the contact belongs to.",
      async options({ page }) {
        const { territories } = await this.listSelectors({
          selector: "territories",
          params: {
            page,
          },
        });

        return territories.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.myfreshworks.com/crm/sales/api`;
    },
    _headers() {
      return {
        "Authorization": `Token token=${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    listContacts({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/lists/${listId}`,
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listSelectors({
      selector, ...opts
    }) {
      return this._makeRequest({
        path: `/selector/${selector}`,
        ...opts,
      });
    },
    searchContactByEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/filtered_search/contact",
        ...opts,
      });
    },
    removeContactFromList({
      listId, ...otps
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/lists/${listId}/remove_contacts`,
        ...otps,
      });
    },
    upsertContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts/upsert",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { contacts } = await fn({
          params,
          ...opts,
        });
        for (const d of contacts) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = contacts.length;

      } while (hasMore);
    },
  },
};
