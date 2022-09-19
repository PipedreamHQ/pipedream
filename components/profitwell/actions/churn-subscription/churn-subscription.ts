import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { ChurnSubscriptionParams } from "../../common/requestParams";
import { Subscription } from "../../common/responseSchemas";

export default defineAction({
  name: "Churn Subscription",
  description:
    "Churn a subscription [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/updating-subscriptions/churn-a-subscription)",
  key: "profitwell-churn-subscription",
  version: "0.0.1",
  type: "action",
  props: {
    profitwell,
    subscriptionIdOrAlias: {
      type: "string",
      label: "Subscription ID or Alias",
      description:
        "Either the `subscription_id` or `subscription_alias` of the subscription",
    },
    effectiveDate: {
      type: "number",
      label: "Effective Date",
      description:
        "UNIX timestamp (in seconds) of when the subscription churns",
    },
    churnType: {
      type: "string",
      label: "Churn Type",
      options: [
        "voluntary",
        "delinquent",
      ],
      default: "voluntary",
    },
  },
  async run({ $ }): Promise<Subscription> {
    const params: ChurnSubscriptionParams = {
      $,
      subscriptionIdOrAlias: this.subscriptionIdOrAlias,
      params: {
        churn_type: this.churnType,
        effective_date: this.effectiveDate,
      },
    };
    const data: Subscription = await this.profitwell.churnSubscription(params);

    $.export("$summary", "Churned subscription successfully");

    return data;
  },
});
