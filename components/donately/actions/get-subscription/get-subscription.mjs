import donately from "../../donately.app.mjs";

export default {
  key: "donately-get-subscription",
  name: "Get Subscription",
  description: "Get a subscription by ID. [See the documentation](https://developer.donate.ly/api/#subscriptions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    donately,
    subscriptionId: {
      propDefinition: [
        donately,
        "subscriptionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.donately.getSubscription({
      $,
      subscriptionId: this.subscriptionId,
    });
    $.export("$summary", `Found subscription ${response?.data?.id}`);
    return response;
  },
};
