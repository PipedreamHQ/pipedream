import dhl from "../../dhl.app.mjs";

export default {
  key: "dhl-update-subscription-status",
  name: "Update Subscription Status",
  description: "Update the status of a subscription. [See the documentation](https://developer.dhl.com/api-reference/dgf-push-api#operations-Timestamp_Push_API_v2-timestampNotificationSubscriptionv2_PATCH)",
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
    status: {
      propDefinition: [
        dhl,
        "status",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dhl.updateSubscriptionStatus({
      $,
      subscriberId: this.subscriptionId,
      data: {
        "status": this.status,
      },
    });
    $.export("$summary", `Successfully updated subscription ${this.subscriptionId} status to ${this.status}`);
    return response;
  },
};
