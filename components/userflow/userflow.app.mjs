import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "userflow",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
      async options({ prevContext }) {
        const {
          hasMore,
          lastId,
        } = prevContext;

        if (hasMore === false) {
          return [];
        }

        const {
          data,
          has_more: hasMoreData,
        } = await this.listUsers({
          params: {
            starting_after: lastId,
          },
        });

        const options = data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));

        return {
          options,
          context: {
            hasMore: hasMoreData,
            lastId: data[data.length - 1]?.id,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The user's email address.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Userflow-Version": constants.API_VERSION,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    getUser({
      userId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listContent(args = {}) {
      return this._makeRequest({
        path: "/content",
        ...args,
      });
    },
    listAttributeDefinitions(args = {}) {
      return this._makeRequest({
        path: "/attribute_definitions",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "/groups",
        ...args,
      });
    },
  },
};
