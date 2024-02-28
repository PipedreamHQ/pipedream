import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reviewflowz",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The account ID associated with your listings.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.reviewflowz.com/v2";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getReviews({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/reviews/${accountId}`,
        ...opts,
      });
    },
    async emitReviewPublishedEvent({ accountId }) {
      const reviews = await this.getReviews({
        accountId,
      });
      // Logic to emit new review events goes here.
      // This is a placeholder to illustrate how you might structure this method.
      // You'll need to replace this with your actual event emitting logic.
      for (const review of reviews) {
        console.log(`New review published: ${review.id}`);
        // Replace console.log with actual event emission logic
      }
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
