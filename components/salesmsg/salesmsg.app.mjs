import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/contants.mjs";

export default {
  type: "app",
  app: "salesmsg",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The id of the contact you want to fetch messages.",
      async options({ page }) {
        const { data } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.salesmessage.com/pub/v2.1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "conversations",
        ...args,
      });
    },
    listMessages(args = {}) {
      return this._makeRequest({
        path: "messages/contacts",
        ...args,
      });
    },
    searchConversations(args = {}) {
      return this._makeRequest({
        path: "conversations/search",
        ...args,
      });
    },
    async *paginate({
      fn, params = {
        filter: "open",
      }, maxResults = null, perPage = false,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        if (perPage) {
          params.page = ++page;
        } else {
          params.limit = LIMIT;
          params.offset = LIMIT * page;
          page++;
        }
        const response = await fn({
          params,
        });
        const data = response.data || response.results || response;

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
    async *paginateMessages({
      maxResults = null, params,
    }) {
      let hasMore = false;
      let count = 0;
      let before = false;

      do {
        params.limit = LIMIT;
        if (before) params.before = before;

        const data = await this.listMessages({
          params,
        });

        for (const d of data) {
          yield d;
          before = d.id;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
