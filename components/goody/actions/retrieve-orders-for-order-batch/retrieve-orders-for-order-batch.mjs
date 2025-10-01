import goody from "../../goody.app.mjs";

export default {
  key: "goody-retrieve-orders-for-order-batch",
  name: "Retrieve Orders For Order Batch",
  description: "Retrieves orders for an order batch in Goody. [See the documentation](https://developer.ongoody.com/api-reference/order-batches/retrieve-orders-for-an-order-batch)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    goody,
    orderBatchId: {
      propDefinition: [
        goody,
        "orderBatchId",
      ],
    },
  },
  async run({ $ }) {
    const items = this.goody.paginate({
      resourceFn: this.goody.retrieveOrdersForOrderBatch,
      args: {
        orderBatchId: this.orderBatchId,
        $,
      },
    });

    const orders = [];
    for await (const item of items) {
      orders.push(item);
    }

    if (orders.length) {
      $.export("$summary", `Successfully retrieved ${orders.length} order${orders.length === 1
        ? ""
        : "s"} for order batch with ID ${this.orderBatchId}.`);
    }

    return orders;
  },
};
