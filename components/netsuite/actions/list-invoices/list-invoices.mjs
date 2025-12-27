import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-list-invoices",
  name: "List Invoices",
  description: "Retrieves a list of invoices from NetSuite. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-invoice)",
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
      description: "The maximum number of invoices to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      searchQuery,
      maxResults,
    } = this;

    const params = {};
    if (searchQuery) params.q = searchQuery;

    const items = [];
    const paginator = app.paginate({
      fn: app.listInvoices,
      fnArgs: {
        $,
        params: Object.keys(params).length > 0
          ? params
          : undefined,
      },
      maxResults,
    });

    for await (const item of paginator) {
      items.push(item);
    }

    $.export("$summary", `Successfully retrieved ${items.length} invoice${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
