import wics from "../../wics.app.mjs";

export default {
  key: "wics-delete-order-line",
  name: "Delete Order Line",
  description: "Delete a line from an order. [See the documentation](https://docs.wics.nl/test-environment.html#orders-delete-order-line)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    wics,
    orderNumber: {
      propDefinition: [
        wics,
        "orderNumber",
      ],
    },
    lineNumber: {
      propDefinition: [
        wics,
        "lineNumber",
        (c) => ({
          orderNumber: c.orderNumber,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.wics.deleteOrderLine({
      $,
      orderNumber: this.orderNumber,
      lineNumber: this.lineNumber,
    });
    $.export("$summary", `Successfully deleted line ${this.lineNumber} from order ${this.orderNumber}`);
    return data;
  },
};
