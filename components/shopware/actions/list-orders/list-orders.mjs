import shopware from "../../shopware.app.mjs";

export default {
  key: "shopware-list-orders",
  name: "List Orders",
  description: "List all orders. [See the documentation](https://shopware.stoplight.io/docs/admin-api/f95b395c5ae73-list-with-basic-information-of-order-resources)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shopware,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of orders to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const orders = this.shopware.paginate({
      $,
      fn: this.shopware.listOrders,
      maxResults: this.maxResults,
    });

    const data = [];
    for await (const order of orders) {
      data.push(order);
    }
    $.export("$summary", `Successfully retrieved ${data.length} orders`);
    return data;
  },
};
