import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-am-budgets",
  name: "List Asset Management Budgets",
  description:
    "List budgets from the Asset Management (AM) API on Universal API. Returns an array of budget objects (paginated internally, up to `maxResults`). [See the documentation](https://docs.universalapi.io/reference/list-budgets).",
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
    const {
      data, hasMore,
    } = await this.app.paginate({
      fn: this.app.listAmBudgets,
      args: {
        $,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} budget(s)`);
    return {
      data,
      hasMore,
    };
  },
};
