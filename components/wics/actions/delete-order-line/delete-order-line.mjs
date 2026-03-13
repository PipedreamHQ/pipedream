import wics from "../../wics.app.mjs";

export default {
  key: "wics-delete-order-line",
  name: "Delete Order Line",
  description: "Delete a line from an order. [See the documentation](https://docs.wics.nl/test-environment.html#orders-delete-order-line)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    wics,
    orderReference: {
      propDefinition: [
        wics,
        "orderReference",
      ],
    },
    lineNumber: {
      propDefinition: [
        wics,
        "lineNumber",
        (c) => ({
          orderReference: c.orderReference,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.wics.deleteOrderLine({
      $,
      orderReference: this.orderReference,
      lineNumber: this.lineNumber,
    });
    $.export("$summary", `Successfully deleted line ${this.lineNumber} from order ${this.orderReference}`);
    return data;
  },
};
