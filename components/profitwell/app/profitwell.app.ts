import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  ChurnSubscriptionParams,
  CreateSubscriptionParams,
  GetCustomerInfoParams,
  HttpRequestParams,
  SearchCustomerParams,
  UpdateSubscriptionParams,
} from "../common/requestParams";
import { Customer } from "../common/responseSchemas";

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
        const customers = await this.searchCustomers({
          email,
        });
        return customers.map(
          ({
            first_name, last_name, customer_id,
          }: Customer) => {
            return {
              label: `${first_name} ${last_name}`,
              value: customer_id,
            };
          },
        );
      },
    },
    effectiveDate: {
      type: "number",
      label: "Effective Date",
    },
    planId: {
      type: "string",
      label: "Plan ID",
      description:
        "The ID of the plan that the user is on. For the sake of consistency (and the ability to later segment your data), this name should be consistent across everyone who is on this plan.",
    },
    planInterval: {
      type: "string",
      label: "Plan Interval",
      description: "The billing cycle for this plan.",
      options: [
        "month",
        "year",
      ],
    },
    value: {
      type: "integer",
      label: "Value",
      description:
        "The amount that you bill your user, per billing period, in cents.",
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
    async churnSubscription({
      subscriptionIdOrAlias,
      ...args
    }: ChurnSubscriptionParams) {
      return this._httpRequest({
        endpoint: `/subscriptions/${subscriptionIdOrAlias}`,
        method: "PUT",
        ...args,
      });
    },
    async updateSubscription({
      subscriptionIdOrAlias,
      ...args
    }: UpdateSubscriptionParams) {
      return this._httpRequest({
        endpoint: `/subscriptions/${subscriptionIdOrAlias}`,
        method: "PUT",
        ...args,
      });
    },
    async searchCustomers(args: SearchCustomerParams) {
      return this._httpRequest({
        endpoint: "/customers",
        ...args,
      });
    },
    async getCustomerInfo({
      $, customerId,
    }: GetCustomerInfoParams) {
      return this._httpRequest({
        $,
        endpoint: `/customers/${customerId}`,
      });
    },
  },
});
