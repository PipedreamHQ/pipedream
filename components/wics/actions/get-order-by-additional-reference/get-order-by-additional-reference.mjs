import wics from "../../wics.app.mjs";

export default {
  key: "wics-get-order-by-additional-reference",
  name: "Get Order by Additional Reference",
  description: "Get an order by its additional reference. [See the documentation](https://docs.wics.nl/test-environment.html#orders-list-orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    wics,
    additionalReference: {
      propDefinition: [
        wics,
        "additionalReference",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.wics.listOrders({
      $,
      params: {
        additionalReference: this.additionalReference,
      },
    });
    if (!data?.length) {
      $.export("$summary", "No order found");
      return;
    }
    $.export("$summary", `Successfully retrieved order with additional reference: ${this.additionalReference}`);
    return data[0];
  },
};
