import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "local_reviews",
  propDefinitions: {},
  methods: {
    _getBaseUrl(path) {
      return `https://api.localreviews.com/api/v2${path}`;
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: this._getBaseUrl(path),
        headers: this._getHeaders(),
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    sendReviewRequestViaEmail(args = {}) {
      return this.post({
        path: "/oauth/oauth-request/send-email",
        ...args,
      });
    },
    sendReviewRequestViaSms(args = {}) {
      return this.post({
        path: "/oauth/oauth-request/send-text",
        ...args,
      });
    },
    getSurveyUrl(args = {}) {
      return this._makeRequest({
        path: "/oauth/oauth-request/get-survey-url",
        ...args,
      });
    },
  },
};
