import softr from "../../softr.app.mjs";

export default {
  key: "softr-list-records",
  name: "List Records",
  description: "Retrieve a list of all records in a table. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/records/get-records)",
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
    fieldNames: {
      propDefinition: [
        softr,
        "fieldNames",
      ],
    },
    viewId: {
      propDefinition: [
        softr,
        "viewId",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        softr,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        softr,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.softr.listRecords({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
      params: {
        viewId: this.viewId,
        fieldNames: this.fieldNames,
        limit: this.limit,
        offset: this.offset,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} record${response.data.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
