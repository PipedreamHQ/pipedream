import { defineApp } from "@pipedream/types";
import {
  axios,
  ConfigurationError,
} from "@pipedream/platform";
import constants from "../common/constants";

export default defineApp({
  type: "app",
  app: "vk",
  propDefinitions: {
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset needed to return a specific subset of resources.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of resources to return (maximum `100`).",
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
            params: {
              offset,
            },
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
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Group ID",
      async options({ prevContext }) {
        const { offset = 0 } = prevContext;
        const { response: { items: groupIds } } =
          await this.getGroups({
            params: {
              offset,
            },
          });
        const { response: groups } =
          await this.getGroupsByIds({
            params: {
              group_ids: groupIds.join(","),
            },
          });
        const options =
          groups.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          }));
        return {
          options,
          context: {
            offset: offset + groupIds.length,
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
        const response = await axios($, config);
        this.throwErrorIfAny(response.error);
        return response;
      } catch (error) {
        console.log("Error", error);
        throw error || "Error in request";
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
    getVideos(args = {}) {
      return this.makeRequest({
        path: "/video.get",
        ...args,
      });
    },
    getPhotos(args = {}) {
      return this.makeRequest({
        path: "/photos.get",
        ...args,
      });
    },
    getGroups(args = {}) {
      return this.makeRequest({
        path: "/groups.get",
        ...args,
      });
    },
    getGroupsByIds(args = {}) {
      return this.makeRequest({
        path: "/groups.getById",
        ...args,
      });
    },
    createCommunity(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/groups.create",
        ...args,
      });
    },
    addCallbackServer(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/groups.addCallbackServer",
        ...args,
      });
    },
    deleteCallbackServer(args = {}) {
      return this.makeRequest({
        method: "delete",
        path: "/groups.deleteCallbackServer",
        ...args,
      });
    },
    throwErrorIfAny(error) {
      if (error) {
        console.log(JSON.stringify(error, null, 2));
        throw new ConfigurationError(error.error_msg);
      }
    },
  },
});
