import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailosaur",
  propDefinitions: {
    serverId: {
      type: "string",
      label: "Server ID",
      description: "The identifier of the server from which the email should be sent.",
      async options() {
        const { items } = await this.listServers();

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    emailId: {
      type: "string",
      label: "Server ID",
      description: "The identifier of the server from which the email should be sent.",
      async options({ serverId }) {
        const { items } = await this.listMessages({
          params: {
            server: serverId,
          },
        });

        return items.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://mailosaur.com/api";
    },
    _auth() {
      return {
        username: "api",
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    listServers() {
      return this._makeRequest({
        path: "/servers",
      });
    },
    listMessages(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
    sendEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    searchMessages(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/search",
        ...opts,
      });
    },
    deleteEmail({
      emailId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/messages/${emailId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = page++;
        params.itemsPerPage = LIMIT;
        const { items } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = items.length;

      } while (hasMore);
    },
  },
};
