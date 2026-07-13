import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-orders",
  name: "List Asset Management Orders",
  description:
    "List orders from the Asset Management (AM) API on Universal API. Returns a cursor-paginated array of AM order objects. This hits a different endpoint than **List Distributor Orders**. [See the documentation](https://docs.universalapi.io/reference/list-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listAmOrders({
      $,
      cursor: this.cursor,
      limit: this.limit,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} AM order(s)`);
    return response;
  },
};
