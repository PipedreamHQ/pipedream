import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "the_bookie",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const { results } = await this.listContacts({
          params: {
            is_client: true,
            admin_id: `${this.$auth.admin_id}`,
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return results.map(({
          id: value, organisation_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.thebookie.nl/nl/api/e1";
    },
    _headers(headers = {}) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        Accept: "application/json",
        ...headers,
      };
    },
    _data(data) {
      return data
        ? {
          ...data,
          admin_id: `${this.$auth.admin_id}`,
        }
        : null;
    },
    _makeRequest({
      $ = this, path, data, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        data: this._data(data),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts/create/",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/",
        ...opts,
      });
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/sales-journals/",
        ...opts,
      });
    },
    createInvoice(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sales-journals/create/",
        ...opts,
      });
    },
    searchContact({
      params, ...opts
    }) {
      return this._makeRequest({
        path: "/contacts",
        params: {
          ...params,
          admin_id: `${this.$auth.admin_id}`,
        },
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        params.admin_id = `${this.$auth.admin_id}`;
        const { results } = await fn({
          params,
          ...opts,
        });
        for (const d of results) {
          yield d;
        }

        hasMore = results.length;

      } while (hasMore);
    },
  },
};
