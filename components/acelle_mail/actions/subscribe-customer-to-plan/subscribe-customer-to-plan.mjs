import app from "../../acelle_mail.app.mjs";

export default {
  name: "Subscribe Customer To Plan",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "acelle_mail-subscribe-customer-to-plan",
  description: "Subscribe customer to a plan. [See the documentation](https://api.acellemail.com/#backend_subscriptions_subscribe)",
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    planId: {
      propDefinition: [
        app,
        "planId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.subscribeCustomerToPlan({
      $,
      customerId: this.customerId,
      planId: this.planId,
    });

    if (response) {
      $.export("$summary", `Successfully subscribed customer \`${this.customerId}\` to plan \`${this.planId}\``);
    }

    return response;
  },
};
