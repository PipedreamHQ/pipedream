import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-update-return-order-status",
  name: "Update Return Order Status",
  description: "Update the status of a return order. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/1d07e272437a4-update-a-return-order-status)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    returnless,
    returnOrderId: {
      propDefinition: [
        returnless,
        "returnOrderId",
      ],
    },
    returnStatusId: {
      propDefinition: [
        returnless,
        "returnStatusId",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.returnless.updateReturnOrderStatus({
      $,
      returnOrderId: this.returnOrderId,
      data: {
        status_id: this.returnStatusId,
      },
    });

    $.export("$summary", `Return Order Status Updated: ${data.id}`);
    return data;
  },
};
