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
    url: {
      type: "string",
      label: "URL",
      description: "The post's URL",
    },
    embedUrl: {
      type: "string",
      label: "Embed URL",
      description: "URL which will have an embed in the post if provided",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Hashtags to add at the end of the post. This will truncate the text of the post. Example: `#pipedream`",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.unshape.app/bluesky";
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
        headers: {
          "X-Bluesky-Username": `${this.$auth.bluesky_username}`,
          "X-Bluesky-Email": `${this.$auth.bluesky_email}`,
          "X-Bluesky-App-Password": `${this.$auth.bluesky_password}`,
          "Accept": "application/json",
        },
      });
    },
    createPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create-post",
        ...opts,
      });
    },
    fetchPost(opts = {}) {
      return this._makeRequest({
        path: "/post",
        ...opts,
      });
    },
    replyPost(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/reply",
        ...opts,
      });
    },
  },
};
