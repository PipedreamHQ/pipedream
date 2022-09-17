import profitwell from "../../app/profitwell.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Churn Subscription",
  description:
    "Churn a subscription [See docs here](https://profitwellapiv2.docs.apiary.io/#/reference/manually-added-customers/updating-subscriptions/churn-a-subscription)",
  key: "profitwell-churn-subscription",
  version: "0.0.1",
  type: "action",
  props: {
    profitwell,
    effectiveDate: {
      type: "string",
      label: "Effective Date",
      description: "UNIX timestamp of when the subscription churns",
    },
    churnType: {
      type: "string",
      label: "Churn Type",
      options: ["voluntary", "delinquent"],
      default: "voluntary",
    },
  },
  async run({ $ }): Promise<any> {
    const params = {
      $,
      data: {},
    };
    const data = await this.profitwell.churnSubscription(params);

    $.export("$summary", "Churned subscription successfully");

    return data;
  },
});
