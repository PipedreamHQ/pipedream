import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "robly",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options() {
        const lists = await this.getLists();
        if (Array.isArray(lists)) {
          return lists.map(({
            sub_list: {
              id: value,
              name: label,
            },
          }) => ({
            label,
            value,
          }));
        }
        return [];
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email address of the contact",
      async options({
        page, listId,
      }) {
        const params = {
          limit: LIMIT,
          offset: page * LIMIT,
          email_only: true,
        };

        if (listId) {
          params.list_id = listId;
        }

        const contacts = await this.getContacts({
          params,
        });

        if (Array.isArray(contacts)) {
          return contacts.map(({ member: { email } }) => email);
        }
        return [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.robly.com/api/v1";
    },
    _getAuthParams(params = {}) {
      return {
        api_id: this.$auth.api_id,
        api_key: this.$auth.api_key,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._getAuthParams(params),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sign_up/generate",
        ...opts,
      });
    },
    addContactToList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts/add_sub_list",
        ...opts,
      });
    },
    removeContactFromList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts/remove_sub_list",
        ...opts,
      });
    },
    getLists(args = {}) {
      return this._makeRequest({
        path: "/sub_lists/show",
        ...args,
      });
    },
    getContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const data = await fn({
          params,
          ...opts,
        });

        if (!Array.isArray(data)) return false;

        for (const d of data) {
          yield d.member;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
