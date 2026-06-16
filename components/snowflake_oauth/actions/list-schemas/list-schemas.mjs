import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  name: "List Schemas",
  key: "snowflake_oauth-list-schemas",
  description: "List the schemas in a Snowflake database. Use the returned names in the Schema field of other actions. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/show-schemas)",
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
      propDefinition: [
        snowflake,
        "database",
      ],
      description: "The database whose schemas you want to list. Run the **List Databases** action first to find database names.",
      optional: false,
    },
  },
  async run({ $ }) {
    const schemas = await this.snowflake.listSchemas(this.database);
    const names = schemas.map((i) => i.name);
    $.export("$summary", `Successfully retrieved ${names.length} schema${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
