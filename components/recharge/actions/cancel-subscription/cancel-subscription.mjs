import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-cancel-subscription",
  name: "Cancel Subscription",
  description: "Cancels an existing subscription. [See the documentation](https://developer.rechargepayments.com/2021-11)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    recharge,
    subscriptionId: {
      propDefinition: [
        recharge,
        "subscriptionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.recharge.cancelSubscription({
      subscriptionId: this.subscriptionId,
    });
    $.export("$summary", `Successfully cancelled subscription ${this.subscriptionId}`);
    return response;
  },
};
