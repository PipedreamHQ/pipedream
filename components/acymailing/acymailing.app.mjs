import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "acymailing",
  propDefinitions: {
    listIds: {
      type: "integer[]",
      label: "List Ids",
      description: "Array of list IDs.",
      async options({ page }) {
        const lists = await this.listLists({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
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
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The email addresses of users to subscribe to the lists. These must match already existing AcyMailing users.",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({ email }) => email);
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.url}`;
    },
    _headers() {
      return {
        "Api-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _params(params) {
      return {
        page: "acymailing_front",
        option: "com_acym",
        ctrl: "api",
        ...params,
      };
    },
    _makeRequest({
      $ = this, params, task, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}`,
        params: this._params({
          ...params,
          task,
        }),
        headers: this._headers(),
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        task: "getUsers",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        task: "getLists",
        ...opts,
      });
    },
    listSubscribersFromLists(opts = {}) {
      return this._makeRequest({
        task: "getSubscribersFromLists",
        ...opts,
      });
    },
    listUnsubscribedUsersFromLists(opts = {}) {
      return this._makeRequest({
        task: "getUnsubscribedUsersFromLists",
        ...opts,
      });
    },
    createUserOrUpdate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        task: "createOrUpdateUser",
        ...opts,
      });
    },
    sendEmailToUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        task: "sendEmailToSingleUser",
        ...opts,
      });
    },
    subscribeUserToLists(opts = {}) {
      return this._makeRequest({
        method: "POST",
        task: "subscribeUsers",
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
        params.offset = LIMIT * page;
        page++;

        const data = await fn({
          params,
          ...opts,
        });

        for (const d of data) {
          yield d;
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },

};
