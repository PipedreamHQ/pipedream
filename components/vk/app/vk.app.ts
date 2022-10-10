import { axios } from "@pipedream/platform";
import { defineApp } from "@pipedream/types";
import constants from "../common/constants";

export default defineApp({
  type: "app",
  app: "vk",
  propDefinitions: {
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset needed to return a specific subset of posts.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of posts to return (maximum `100`).",
      max: 100,
      optional: true,
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "Post ID",
      async options({ prevContext }) {
        const { offset = 0 } = prevContext;
        const { response: { items } } =
          await this.getWallPosts({
            offset,
          });
        const options =
          items.map(({
            id: value, text: label,
          }) => ({
            value,
            label,
          }));
        return {
          options,
          context: {
            offset: offset + items.length,
          },
        };
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getParams(params) {
      return {
        v: constants.API_VERSION,
        access_token: this.$auth.oauth_access_token,
        ...params,
      };
    },
    async makeRequest({
      $ = this, path = "", url = "", params = {}, ...args
    } = {}) {
      const config = {
        params: this.getParams(params),
        url: this.getUrl(path, url),
        ...args,
      };
      console.log("conf", config);

      try {
        return await axios($, config);
      } catch (error) {
        console.log("Error", error);
        throw "Error";
      }
    },
    getWallPosts(args = {}) {
      return this.makeRequest({
        path: "/wall.get",
        ...args,
      });
    },
    getWallPost(args = {}) {
      return this.makeRequest({
        path: "/wall.getById",
        ...args,
      });
    },
    getProfileInfo(args = {}) {
      return this.makeRequest({
        path: "/account.getProfileInfo",
        ...args,
      });
    },
    getUsers(args = {}) {
      return this.makeRequest({
        path: "/users.get",
        ...args,
      });
    },
  },
});
