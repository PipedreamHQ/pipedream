import { defineApp } from "@pipedream/types";
import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  ChurnSubscriptionParams,
  CreateSubscriptionParams,
  GetCustomerInfoParams,
  HttpRequestParams,
  SearchCustomerParams,
  UpdateSubscriptionParams,
} from "../common/requestParams";
import {
  Customer, Subscription,
} from "../common/responseSchemas";

export default defineApp({
  type: "app",
  app: "profitwell",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description:
        "Search for customers with the email address entered above. You can also provide a custom *Customer ID*.",
      async options({ email }: {
        email: string;
      }): Promise<{ label: string; value: string; }[]> {
        const searchParams: SearchCustomerParams = {
          params: {
            email,
          },
        };
        const customers = await this.searchCustomers(searchParams);
        return customers.map((customer: Customer) => {
          const label: string = this.getCustomerLabel(customer);
          return {
            label,
            value: customer.customer_id,
          };
        });
      },
    },
    effectiveDate: {
      type: "string",
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
    subscriptionIdOrAlias: {
      type: "string",
      label: "Subscription ID or Alias",
      description:
        "Either the `subscription_id` or `subscription_alias` of the subscription",
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
    async createSubscription(
      args: CreateSubscriptionParams,
    ): Promise<Subscription> {
      return this._httpRequest({
        endpoint: "/subscriptions/",
        method: "POST",
        ...args,
      });
    },
    async churnSubscription({
      subscriptionIdOrAlias,
      ...args
    }: ChurnSubscriptionParams): Promise<Subscription> {
      return this._httpRequest({
        endpoint: `/subscriptions/${subscriptionIdOrAlias}/`,
        method: "DELETE",
        ...args,
      });
    },
    async updateSubscription({
      subscriptionIdOrAlias,
      ...args
    }: UpdateSubscriptionParams): Promise<Subscription> {
      return this._httpRequest({
        endpoint: `/subscriptions/${subscriptionIdOrAlias}/`,
        method: "PUT",
        ...args,
      });
    },
    async searchCustomers(args: SearchCustomerParams): Promise<Customer[]> {
      return this._httpRequest({
        endpoint: "/customers/",
        ...args,
      });
    },
    async getCustomerInfo({
      $,
      customerId,
    }: GetCustomerInfoParams): Promise<Customer> {
      return this._httpRequest({
        $,
        endpoint: `/customers/${customerId}/`,
      });
    },
    getCustomerLabel({
      first_name, email, last_name,
    }: Customer): string {
      let label = "";
      [
        first_name,
        last_name,
      ].forEach((name) => (label += ` ${name}`));
      label = label.trim();

      label = label
        ? (label += ` (${email})`)
        : email;

      return label;
    },
    getUnixTimestamp(dateString: string): number {
      const number = Number(dateString);
      if (!isNaN(number)) {
        return number;
      }

      const date = new Date(dateString);
      const value = date.valueOf();
      if (isNaN(value)) {
        throw new ConfigurationError(
          "**Invalid date provided.** Make sure it is either a UNIX timestamp in seconds, or a valid ISO 8601 string such as `2022-02-15`",
        );
      }

      return Math.floor(value / 1000);
    },
  },
});
