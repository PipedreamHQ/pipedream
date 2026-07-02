import softr from "../../softr.app.mjs";

export default {
  key: "softr-list-table-views",
  name: "List Table Views",
  description: "Retrieve a list of all views in a table. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/tables/get-table-views)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    softr,
    databaseId: {
      propDefinition: [
        softr,
        "databaseId",
      ],
    },
    tableId: {
      propDefinition: [
        softr,
        "tableId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.listViews({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} view${response.data.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
