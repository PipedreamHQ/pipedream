import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "centralstationcrm",
  propDefinitions: {
    responsibleUserId: {
      type: "string",
      label: "Responsible User",
      description: "Identifier of the responsible user",
      optional: true,
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page: page + 1,
            active: "true",
          },
        });
        return users?.map(({ user }) => ({
          value: user.id,
          label: `${user.first} ${user.name}`,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account_name}.centralstationcrm.net/api`;
    },
    _headers() {
      return {
        "X-apikey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users.json",
        ...args,
      });
    },
    listPeople(args = {}) {
      return this._makeRequest({
        path: "/people.json",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals.json",
        ...args,
      });
    },
    createPerson(args = {}) {
      return this._makeRequest({
        path: "/people.json",
        method: "POST",
        ...args,
      });
    },
    createDeal(args = {}) {
      return this._makeRequest({
        path: "/deals.json",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      resourceFn, params = {},
    }) {
      params = {
        ...params,
        page: 1,
        perpage: constants.DEFAULT_LIMIT,
      };
      let total = 0;

      do {
        const items = await resourceFn({
          params,
        });
        for (const item of items) {
          yield item;
        }
        total = items?.length;
        params.page++;
      } while (total === params.perpage);
    },
  },
};
