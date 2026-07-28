import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-shipping-labels",
  name: "List Shipping Labels",
  description: "List the shipping labels of an order. Use this to retrieve the label file names, typically after generating labels with **Create Shipping Label**. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1shippinglabels/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const labels = await this.monta.listShippingLabels({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved ${labels.length} shipping label${labels.length === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return labels;
  },
};
