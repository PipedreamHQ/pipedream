import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bluesky_by_unshape",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The body of the post",
    },
    author: {
      type: "string",
      label: "Author",
      description: "The creator of the post",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the post",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The identifier of the post",
    },
    replyContent: {
      type: "string",
      label: "Reply Content",
      description: "The body of the reply",
    },
    replyAuthor: {
      type: "string",
      label: "Reply Author",
      description: "The author of the reply",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.unshape.app/bluesky";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: this.$auth.oauth_access_token,
        },
      });
    },
    async createPost({
      content, author, title, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/create-post",
        data: {
          content,
          author,
          title,
          tags,
        },
      });
    },
    async fetchPost({ url }) {
      return this._makeRequest({
        path: `/post/${url}`,
      });
    },
    async replyPost({
      url, replyContent, replyAuthor,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/reply/${url}`,
        data: {
          replyContent,
          replyAuthor,
        },
      });
    },
  },
};
