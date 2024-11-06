import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zendesk_sell",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.getbase.com/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          accept: "application/json",
        },
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/deals",
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
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    async *paginate({
      fn,
      params,
      max,
    }) {
      params = {
        ...params,
        per_page: 100,
        page: 1,
      };
      let total, count = 0;
      do {
        const { items } = await fn({
          params,
        });
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items?.length;
        params.page++;
      } while (total);
    },
  },
};
