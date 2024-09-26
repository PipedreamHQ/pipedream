import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "espocrm",
  propDefinitions: {
    assigneeId: {
      type: "string",
      label: "Assigned User",
      description: "User to assign to the task",
      async options({ page }) {
        const maxSize = constants.DEFAULT_LIMIT;
        const { list } = await this.getUsers({
          params: {
            maxSize,
            offset: page * maxSize,
          },
        });
        return list?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.url}/api/v1`;
    },
    _headers() {
      return {
        "X-Api-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Webhook",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/Webhook/${hookId}`,
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Contact",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Task",
        ...opts,
      });
    },
    getAccounts(opts = {}) {
      return this._makeRequest({
        path: "/Account",
        ...opts,
      });
    },
    getUsers(opts = {}) {
      return this._makeRequest({
        path: "/User",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          maxSize: constants.DEFAULT_LIMIT,
          offset: 0,
        },
      };
      let total = 0;
      do {
        const { list } = await resourceFn(args);
        for (const item of list) {
          yield item;
        }
        total = list?.length;
        args.params.offset += args.params.maxSize;
      } while (total === args.params.maxSize);
    },
  },
};
