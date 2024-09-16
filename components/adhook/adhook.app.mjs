import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "adhook",
  propDefinitions: {
    subtenantId: {
      type: "string",
      label: "Subtenant Id",
      description: "The id of the subtenant.",
      async options() {
        const data = await this.listSubtenants();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post",
      async options({ page }) {
        const data = await this.listPosts({
          params: {
            limit: constants.LIMIT,
            skip: constants.LIMIT * page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A list of tags.",
    },
    topics: {
      type: "string[]",
      label: "Topics",
      description: "A list of topics.",
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "An external Id to the event",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.adhook.io/api/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
    createCalendarEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customEvents",
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        path: "/posts",
        ...opts,
      });
    },
    listSubtenants(opts = {}) {
      return this._makeRequest({
        path: "/subtenants",
        ...opts,
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/posts",
        ...opts,
      });
    },
    getPost({ postId }) {
      return this._makeRequest({
        path: `/posts/${postId}`,
      });
    },
    updatePost({
      postId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/posts/${postId}`,
        ...opts,
      });
    },
    listCreatedPosts() {
      return this._makeRequest({
        path: "/posts/recentlyCreated",
      });
    },
    listUpdatedPosts() {
      return this._makeRequest({
        path: "/posts/recentlyUpdated",
      });
    },
  },
};
