import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "herobot_chatbot_marketing",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, full_name: fullName, email,
        }) => ({
          label: email || fullName,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://my.herobot.app/api";
    },
    _headers() {
      return {
        "X-ACCESS-TOKEN": `${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users/",
        ...opts,
      });
    },
    sendMessage({
      userId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/send/text`,
        ...opts,
      });
    },
    createUser(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        ...opts,
      });
    },
    createCustomField(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts/custom_fields",
        ...opts,
      });
    },
    getUserTags({ userId }) {
      return this._makeRequest({
        path: `/users/${userId}/tags`,
      });
    },
    getTag({ tagId }) {
      return this._makeRequest({
        path: `/accounts/tags/${tagId}`,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const data = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
