import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-checkout",
  name: "Retrieve Checkout",
  description: "Retrieve a checkout by ID. [See the documentation](https://developer.surecart.com/api-reference/checkouts/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    checkoutId: {
      propDefinition: [
        surecart,
        "checkoutId",
      ],
    },
    refreshStatus: {
      type: "boolean",
      label: "Refresh Status",
      description: "Set to `true` to check the payment processor for the latest status changes before returning. Useful to avoid timing issues with webhooks.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getCheckout({
      $,
      checkoutId: this.checkoutId,
      refreshStatus: this.refreshStatus,
    });
    $.export("$summary", `Successfully retrieved checkout ${this.checkoutId}`);
    return response;
  },
};
