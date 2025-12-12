import glide from "../../glide.app.mjs";

export default {
  key: "glide-get-rows",
  name: "Get Rows",
  description: "Get rows from a specified table. [See the documentation](https://apidocs.glideapps.com/api-reference/v2/tables/get-table-rows)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    glide,
    tableId: {
      propDefinition: [
        glide,
        "tableId",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of rows to return",
      optional: true,
      default: 100,
    },
    continuation: {
      type: "string",
      label: "Continuation Token",
      description: "Token for pagination to get the next set of results",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.limit) {
      params.limit = this.limit;
    }
    if (this.continuation) {
      params.continuation = this.continuation;
    }

    const response = await this.glide.getRows({
      $,
      tableId: this.tableId,
      params,
    });

    const rowCount = response.data?.length || 0;
    const plural = rowCount === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully retrieved ${rowCount} row${plural}`);
    return response;
  },
};

