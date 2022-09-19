import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ChurnSubscriptionParams, CreateSubscriptionParams, HttpRequestParams,
} from "../common/requestParams";

export default defineApp({
  type: "app",
  app: "profitwell",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description:
        "Search for customers with the email address entered above. You can also provide a custom *Customer ID*.",
      async options({ email }) {
        const customers = await this.searchCustomers({ email });
        return customers.map(({ first_name, last_name, customer_id }) => {
          return {
            label: `${first_name} ${last_name}`,
            value: customer_id,
          };
        });
      },
    },
  },
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
