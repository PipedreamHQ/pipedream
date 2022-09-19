import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";
import { UpdateSubscriptionParams } from "../../common/requestParams";
import { Subscription } from "../../common/responseSchemas";

export default defineAction({
  name: "Update Subscription",
  description:
    "Upgrade/downgrade a subscription [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/updating-subscriptions/upgrade-downgrade-a-subscription)",
  key: "profitwell-update-subscription",
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
  async run({ $ }): Promise<Subscription> {
    const params: UpdateSubscriptionParams = {
      $,
      subscriptionIdOrAlias: this.subscriptionIdOrAlias,
      data: {
        effective_date: this.effectiveDate,
        plan_id: this.planId,
        plan_interval: this.planInterval,
        value: this.value,
      },
    };
    const data: Subscription = await this.profitwell.updateSubscription(params);

    $.export("$summary", "Updated subscription successfully");

    return data;
  },
});
