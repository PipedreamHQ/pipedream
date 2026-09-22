import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-subscription",
  name: "Retrieve Subscription",
  description: "Retrieve a subscription by ID. [See the documentation](https://developer.surecart.com/api-reference/subscriptions/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    subscriptionId: {
      propDefinition: [
        surecart,
        "subscriptionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getSubscription({
      $,
      subscriptionId: this.subscriptionId,
    });
    $.export("$summary", `Successfully retrieved subscription ${this.subscriptionId}`);
    return response;
  },
};
