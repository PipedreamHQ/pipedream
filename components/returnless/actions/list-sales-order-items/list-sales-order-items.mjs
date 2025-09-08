import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-list-sales-order-items",
  name: "List Sales Order Items",
  description: "Retrieve all items from a specific sales order with cursor-based pagination support. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/6b3c26dad0434-list-all-items-of-a-sales-order)",
  version: "0.0.1",
  type: "action",
  props: {
    returnless,
    orderId: {
      propDefinition: [
        returnless,
        "orderId",
      ],
    },
    maxResults: {
      propDefinition: [
        returnless,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const salesOrderItems = await this.returnless.getPaginatedResources({
      fn: this.returnless.listSalesOrderItems,
      args: {
        $,
        orderId: this.orderId,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Retrieved ${salesOrderItems.length} sales order item${salesOrderItems.length === 1
      ? ""
      : "s"} from order ${this.orderId}`);
    return salesOrderItems;
  },
};
