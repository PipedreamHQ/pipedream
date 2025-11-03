import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-get-table-detail",
  name: "Get Table Detail",
  description: "Get detailed information about a specific table. [See the documentation](https://keboola.docs.apiary.io/#reference/tables/manage-tables/table-detail)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    keboola,
    bucketId: {
      propDefinition: [
        keboola,
        "bucketId",
      ],
    },
    tableId: {
      propDefinition: [
        keboola,
        "tableId",
        (c) => ({
          bucketId: c.bucketId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.keboola.getTableDetails({
      $,
      tableId: this.tableId,
    });
    $.export("$summary", `Successfully retrieved details for table ID: ${this.tableId}`);
    return response;
  },
};
