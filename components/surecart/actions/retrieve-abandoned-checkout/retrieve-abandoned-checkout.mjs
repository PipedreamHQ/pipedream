import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-retrieve-abandoned-checkout",
  name: "Retrieve Abandoned Checkout",
  description: "Retrieve an abandoned checkout by ID. [See the documentation](https://developer.surecart.com/api-reference/abandoned-checkouts/retrieve)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    abandonedCheckoutId: {
      propDefinition: [
        surecart,
        "abandonedCheckoutId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surecart.getAbandonedCheckout({
      $,
      abandonedCheckoutId: this.abandonedCheckoutId,
    });
    $.export("$summary", `Successfully retrieved abandoned checkout ${this.abandonedCheckoutId}`);
    return response;
  },
};
