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
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription to get. Use the **List Subscriptions** action to get a list of subscription IDs.",
      optional: false,
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
