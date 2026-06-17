import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  key: "snowflake_oauth-list-tables",
  name: "List Tables",
  description: "List the tables in a Snowflake schema. Use the returned fully-qualified names in the Table Name field of other actions. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/show-tables)",
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
      description: "The database. Run the **List Databases** action first.",
    },
    schema: {
      propDefinition: [
        snowflake,
        "schema",
      ],
      description: "The schema. Run the **List Schemas** action (with your database) first.",
    },
  },
  async run({ $ }) {
    const tables = await this.snowflake.listTables({
      database: this.database,
      schema: this.schema,
    });
    const names = tables.map((i) => `${this.database}.${this.schema}.${i.name}`);
    $.export("$summary", `Successfully retrieved ${names.length} table${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
