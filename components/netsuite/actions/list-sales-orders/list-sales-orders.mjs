import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-list-sales-orders",
  name: "List Sales Orders",
  description: "Retrieves a list of sales orders. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-salesOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    searchQuery: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of sales orders to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      searchQuery,
      maxResults,
    } = this;

    const items = [];
    const paginator = app.paginate({
      fn: app.listSalesOrders,
      fnArgs: {
        $,
        params: {
          q: searchQuery,
        },
      },
      maxResults,
    });

    for await (const item of paginator) {
      items.push(item);
    }

    $.export("$summary", `Successfully retrieved ${items.length} sales order${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
