import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshsales",
  propDefinitions: {
    contactId: {
      type: "integer",
      label: "Contact ID",
      description: "Select a contact or provide a contact ID",
      async options() {
        const response = await this.listContacts();
        return response.contacts?.map(({
          id, first_name, last_name, email,
        }) => ({
          label: `${first_name || ""} ${last_name || ""}`.trim() || email || `Contact ${id}`,
          value: id,
        })) || [];
      },
    },
    dealId: {
      type: "integer",
      label: "Deal ID",
      description: "Select a deal or provide a deal ID",
      async options() {
        const response = await this.listDeals();
        return response.deals?.map(({
          id, name,
        }) => ({
          label: name || `Deal ${id}`,
          value: id,
        })) || [];
      },
    },
    ownerId: {
      type: "integer",
      label: "Owner ID",
      description: "Select an owner or provide an owner ID",
      async options() {
        const response = await this._makeRequest({
          method: "GET",
          url: "/users",
        });
        return response.users?.map(({
          id, display_name, email,
        }) => ({
          label: display_name || email || `User ${id}`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _headers() {
      return {
        "Authorization": `Token token=${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _baseUrl() {
      return `https://${this.$auth.bundle_alias}/api`;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    async getFilterId({
      model, name, ...opts
    }) {
      const { filters } =  await this._makeRequest({
        path: `/${model}/filters`,
        ...opts,
      });
      return filters.find((filter) => filter.name === name).id;
    },
    listContacts({
      filterId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/view/${filterId}`,
        ...opts,
      });
    },
    listDeals({
      filterId, ...opts
    }) {
      return this._makeRequest({
        path: `/deals/view/${filterId}`,
        ...opts,
      });
    },
    getContactFields(opts = {}) {
      return this._makeRequest({
        path: "/settings/contacts/fields",
        ...opts,
      });
    },
    getDealFields(opts = {}) {
      return this._makeRequest({
        path: "/settings/deals/fields",
        ...opts,
      });
    },
    async getSalesAccounts(opts = {}) {
      const filterId = await this.getFilterId({
        model: "sales_accounts",
        name: "All Accounts",
      });
      return this._makeRequest({
        path: `/sales_accounts/view/${filterId}`,
        ...opts,
      });
    },
    async getContacts(opts = {}) {
      const filterId = await this.getFilterId({
        model: "contacts",
        name: "All Contacts",
      });
      return this._makeRequest({
        path: `/contacts/view/${filterId}`,
        ...opts,
      });
    },
    createContact(args) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    createDeal(args) {
      return this._makeRequest({
        path: "/deals",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, responseField, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });

        for (const d of data[responseField]) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data[responseField].length;

      } while (hasMore);
    },
  },
};
