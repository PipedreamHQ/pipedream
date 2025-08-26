import dhl from "../../dhl.app.mjs";

export default {
  key: "dhl-get-subscription-details",
  name: "Get Subscription Details",
  description: "Get details about a subscription. [See the documentation](https://developer.dhl.com/api-reference/dgf-push-api#operations-Timestamp_Push_API_v2-timestampNotificationSubscriptionv2_GET)",
  version: "0.0.1",
  type: "action",
  props: {
    dhl,
    subscriptionId: {
      propDefinition: [
        dhl,
        "subscriptionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dhl.getSubscriptionDetails({
      $,
      subscriberId: this.subscriptionId,
    });
    $.export("$summary", `Successfully fetched subscription details for ${this.subscriptionId}`);
    return response;
  },
};
