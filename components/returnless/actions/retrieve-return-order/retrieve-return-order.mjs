import app from "../../returnless.app.mjs";

export default {
  key: "returnless-retrieve-return-order",
  name: "Retrieve Return Order",
  description: "Retrieve a return order. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/f670282943eae-retrieve-a-return-order)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    returnOrderId: {
      propDefinition: [
        app,
        "returnOrderId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.app.getReturnOrder({
      $,
      returnOrderId: this.returnOrderId,
    });

    $.export("$summary", `Successfully retrieved return order ${this.returnOrderId}`);
    return data;
  },
};
