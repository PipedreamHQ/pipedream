import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ChurnSubscriptionParams, CreateSubscriptionParams, HttpRequestParams,
} from "../common/requestParams";

export default defineApp({
  type: "app",
  app: "profitwell",
  methods: {
    _baseUrl(): string {
      return "https://api.profitwell.com/v2";
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        url: this._baseUrl() + endpoint,
        headers: {
          "Content-Type": "application/json",
          "Authorization": this.$auth.api_token,
        },
        ...args,
      });
    },
    async createSubscription(args: CreateSubscriptionParams) {
      return this._httpRequest({
        endpoint: "/subscriptions",
        method: "PUT",
        ...args,
      });
    },
    async churnSubscription(args: ChurnSubscriptionParams) {
      return this._httpRequest({
        endpoint: `/subscriptions/${args.subscriptionIdOrAlias}`,
        method: "PUT",
        ...args,
      });
    },
  },
});
