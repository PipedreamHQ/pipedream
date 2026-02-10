import { axios } from "@pipedream/platform";
const LIMIT = 100;

export default {
  type: "app",
  app: "getprospect",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "List IDs",
      description: "The IDs of the lists to create the contact in",
      async options({ page }) {
        const lists = await this.listLists({
          params: {
            pageNumber: page + 1,
            pageSize: 50,
          },
        });
        return lists?.map(({
          _id: value,
          name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getprospect.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          apiKey: this.$auth.api_key,
        },
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/contacts/lists",
        ...opts,
      });
    },
    listProperties(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/properties",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/contacts/contact/search",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/v1/insights/companies",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/public/v1/insights/contacts",
        ...opts,
      });
    },
    verifyEmail(opts = {}) {
      return this._makeRequest({
        path: "/public/v1/email/verify",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/contacts/contact",
        ...opts,
      });
    },
    async *paginate({
      fn, params, data, max,
    }) {
      params = {
        ...params,
        pageNumber: 1,
        pageSize: LIMIT,
      };
      let total = 0, count = 0;
      do {
        const { data: items } = await fn({
          params,
          data,
        });
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = data?.total;
        params.pageNumber++;
      } while (total === params.pageSize);
    },
  },
};
