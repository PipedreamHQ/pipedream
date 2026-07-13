import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-orders",
  name: "List Asset Management Orders",
  description:
    "List orders from the Asset Management (AM) API on Universal API. Returns an array of AM order objects (paginated internally, up to `maxResults`). This hits a different endpoint than **List Distributor Orders**. [See the documentation](https://docs.universalapi.io/reference/list-orders)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.paginate({
      fn: this.app.listAmOrders,
      args: {
        $,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${response.length} AM order(s)`);
    return response;
  },
};
