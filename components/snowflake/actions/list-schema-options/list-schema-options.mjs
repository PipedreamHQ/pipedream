import snowflake from "../../snowflake.app.mjs";

export default {
  key: "snowflake-list-schema-options",
  name: "List Schema Options",
  description: "Retrieves available options for the Schema field.",
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
      description: "The database to list schemas for. Run **List Database Options** to find available databases.",
    },
  },
  async run({ $ }) {
    const options = await this.snowflake.listSchemas(this.database);
    const names = options.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} option${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
