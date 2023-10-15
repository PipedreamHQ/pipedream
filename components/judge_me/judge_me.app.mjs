import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "judge_me",
  propDefinitions: {
    reviewId: {
      label: "Review Id",
      description: "The Review unique identifier.",
      type: "integer",
      async options({ prevContext }) {
        const page = (prevContext?.page || 0) + 1;
        const response = await this.getReviews({
          page,
        });
        return {
          options: response.reviews.map((review) => ({
            label: review.title,
            value: review.id,
          })),
          context: {
            page,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://judge.me/api/v1";
    },
    _token() {
      return {
        api_token: `${this.$auth.oauth_access_token}`,
        shop_domain: `${this.$auth.shop_domain}`,
      };
    },
    async _makeRequest({
      $ = this, path, params = {}, ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          ...this._token(),
        },
        ...args,
      };
      return axios($, config);
    },
    getReviews({
      $ = this,
      page = 1,
    }) {
      return this._makeRequest({
        $,
        path: "/reviews",
        params: {
          page,
        },
      });
    },
    createWebhook({ data }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        data,
      });
    },
    removeWebhook({ data }) {
      return this._makeRequest({
        path: "/webhooks",
        method: "DELETE",
        data,
      });
    },
    reply({
      $ = this,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/replies",
        data,
        returnFullResponse: true,
      });
    },
    privateReply({
      $ = this,
      data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/private_replies",
        data,
        returnFullResponse: true,
      });
    },
  },
};
