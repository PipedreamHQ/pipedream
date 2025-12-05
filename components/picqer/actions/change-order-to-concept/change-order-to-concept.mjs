import app from "../../picqer.app.mjs";

export default {
  key: "picqer-change-order-to-concept",
  name: "Change Order To Concept",
  description: "Converts expected orders back to concept status for editing. [See the documentation](https://picqer.com/en/api/orders)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orderId: {
      propDefinition: [
        app,
        "orderId",
        () => ({
          params: {
            status: "expected",
          },
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.changeOrderToConcept({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully changed order ${this.orderId} to concept status`);
    return response;
  },
};
