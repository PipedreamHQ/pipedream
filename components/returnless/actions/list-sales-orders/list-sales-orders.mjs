import returnless from "../../returnless.app.mjs";

export default {
  key: "returnless-list-sales-orders",
  name: "List Sales Orders",
  description: "Retrieve a list of sales orders sorted by creation date, with the most recent sales orders appearing first. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/ce6a0e3d66378-list-all-sales-orders)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    returnless,
    maxResults: {
      propDefinition: [
        returnless,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const salesOrders = await this.returnless.getPaginatedResources({
      fn: this.returnless.listSalesOrders,
      args: {
        $,
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${salesOrders.length} sales order${salesOrders.length === 1
      ? ""
      : "s"}`);
    return salesOrders;
  },
};
