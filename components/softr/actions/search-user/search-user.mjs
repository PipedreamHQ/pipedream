import softr from "../../softr.app.mjs";

export default {
  key: "softr-search-user",
  name: "Search User",
  description: "Searches for user records in a Softr database by field value. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/records/search-records)",
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
    fieldName: {
      type: "string",
      label: "Field Name",
      description: "The name of the field to search by (e.g., `email`)",
    },
    fieldValue: {
      type: "string",
      label: "Field Value",
      description: "The value to search for in the specified field",
    },
  },
  async run({ $ }) {
    const response = await this.softr.searchRecords({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
      data: {
        filters: [
          {
            field_name: this.fieldName,
            operator: "is",
            field_value: this.fieldValue,
          },
        ],
      },
    });
    const records = response?.records ?? response ?? [];
    const count = Array.isArray(records)
      ? records.length
      : 0;
    $.export("$summary", `Found ${count} record(s) matching ${this.fieldName} = "${this.fieldValue}"`);
    return response;
  },
};
