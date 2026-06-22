import snowflake from "../../snowflake.app.mjs";

export default {
  key: "snowflake-list-table-options",
  name: "List Table Options",
  description: "Retrieves available options for the Table Name field.",
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
      description: "The database to list tables for. Run **List Database Options** to find available databases.",
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to list tables for. Run **List Schema Options** to find available schemas.",
    },
  },
  async run({ $ }) {
    const options = await this.snowflake.listTables({
      database: this.database,
      schema: this.schema,
    });
    const names = options.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} option${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
