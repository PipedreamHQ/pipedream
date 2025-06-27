import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "akismet",
  propDefinitions: {
    blog: {
      type: "string",
      label: "Blog URL",
      description: "The URL of the blog where the comment was posted",
    },
    userIp: {
      type: "string",
      label: "User IP",
      description: "The IP address of the comment author",
    },
    permalink: {
      type: "string",
      label: "Permalink",
      description: "The full permanent URL of the entry the comment was submitted to",
    },
    userAgent: {
      type: "string",
      label: "User Agent",
      description: "The user agent string of the web browser used to submit the comment",
      optional: true,
    },
    referrer: {
      type: "string",
      label: "Referrer URL",
      description: "The URL of the page that submitted the comment",
      optional: true,
    },
    commentAuthor: {
      type: "string",
      label: "Comment Author Name",
      description: "The name submitted with the comment",
      optional: true,
    },
    commentAuthorEmail: {
      type: "string",
      label: "Comment Author Email",
      description: "The email address submitted with the comment",
      optional: true,
    },
    commentAuthorUrl: {
      type: "string",
      label: "Comment Author URL",
      description: "The URL submitted with the comment",
      optional: true,
    },
    commentContent: {
      type: "string",
      label: "Comment Content",
      description: "The content of the comment itself",
      optional: true,
    },
    commentType: {
      type: "string",
      label: "Comment Type",
      description: "The type of comment",
      optional: true,
      options: constants.COMMENT_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.akismet.com/1.1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        data,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        data: {
          api_key: `${this.$auth.api_key}`,
          ...data,
        },
      });
    },
    async submitSpam(args = {}) {
      return this._makeRequest({
        path: "/submit-spam",
        method: "post",
        ...args,
      });
    },
    async submitHam(args = {}) {
      return this._makeRequest({
        path: "/submit-ham",
        method: "post",
        ...args,
      });
    },
    async checkComment(args = {}) {
      return this._makeRequest({
        path: "/comment-check",
        method: "post",
        ...args,
      });
    },
  },
};
