import dhl from "../../dhl.app.mjs";

export default {
  key: "dhl-list-subscriptions",
  name: "List Subscriptions",
  description: "List all subscriptions. [See the documentation](https://developer.dhl.com/api-reference/dgf-push-api#operations-Timestamp_Push_API_v2-timestampNotificationSubscriptionv2_GET)",
  version: "0.0.1",
  type: "action",
  props: {
    dhl,
  },
  async run({ $ }) {
    const response = await this.dhl.listSubscriptions({
      $,
    });
    $.export("$summary", `Successfully listed ${response.subscriptions?.length || 0} subscriptions`);
    return response;
  },
};
