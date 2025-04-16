import { axios } from "@pipedream/platform";
const LIMIT = 100;

export default {
  type: "app",
  app: "cogmento",
  propDefinitions: {
    userIds: {
      type: "string[]",
      label: "User IDs",
      description: "An array of user IDs to assign to the deal",
      async options() {
        const { response: { user } } = await this.getUser();
        return [
          {
            label: (`${user?.first_name} ${user?.last_name}`).trim(),
            value: user.id,
          },
        ];
      },
    },
    productIds: {
      type: "string[]",
      label: "Product IDs",
      description: "An array of product IDs to include in the deal",
      async options({ page }) {
        const { response: { results } } = await this.listProducts({
          params: {
            limit: LIMIT,
            start: page * LIMIT,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "Identifier of a deal to associate with the task",
      async options({ page }) {
        const { response: { results } } = await this.listDeals({
          params: {
            limit: LIMIT,
            start: page * LIMIT,
          },
        });
        return results?.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "Identifier of a contact to associate with the task",
      async options({ page }) {
        const { response: { results } } = await this.listContacts({
          params: {
            limit: LIMIT,
            start: page * LIMIT,
          },
        });
        return results?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.cogmento.com/api/1";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Accept: "application/json",
          Authorization: `Token ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getUser(opts = {}) {
      return this._makeRequest({
        path: "/auth/user",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/",
        ...opts,
      });
    },
    listDeals(opts = {}) {
      return this._makeRequest({
        path: "/deals/",
        ...opts,
      });
    },
    listTasks(opts = {}) {
      return this._makeRequest({
        path: "/tasks/",
        ...opts,
      });
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: "/products/",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts/",
        ...opts,
      });
    },
    createDeal(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/deals/",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks/",
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: LIMIT,
          start: 0,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          response: {
            results, total,
          },
        } = await fn(args);
        for (const item of results) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        args.params.start += args.params.limit;
        hasMore = count < total;
      } while (hasMore);
    },
  },
};
