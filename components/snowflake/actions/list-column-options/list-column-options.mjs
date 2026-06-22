import snowflake from "../../snowflake.app.mjs";

export default {
  key: "snowflake-list-column-options",
  name: "List Column Options",
  description: "Retrieves available options for the Columns field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    snowflake,
    database: {
      type: "string",
      label: "Database",
      description: "The database the table belongs to. Run **List Database Options** to find available databases.",
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema the table belongs to. Run **List Schema Options** to find available schemas.",
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The table to list columns for. Run **List Table Options** to find available tables.",
    },
  },
  async run({ $ }) {
    const tableName = `${this.database}.${this.schema}.${this.tableName}`;
    const options = await this.snowflake.listFieldsForTable(tableName);
    const names = options.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} option${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
