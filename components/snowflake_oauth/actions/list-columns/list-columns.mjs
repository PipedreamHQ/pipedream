import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  key: "snowflake_oauth-list-columns",
  name: "List Columns",
  description: "List the columns of a Snowflake table. Use the returned names in the Columns field of the Insert Multiple Rows action. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/desc-table)",
  version: "0.0.1",
  type: "action",
  props: {
    snowflake,
    tableName: {
      propDefinition: [
        snowflake,
        "tableName",
      ],
      description: "The fully-qualified table name in `database.schema.table` form. Run the **List Tables** action first to find it.",
      optional: false,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  async run({ $ }) {
    const fields = await this.snowflake.listFieldsForTable(this.tableName);
    const names = fields.map((field) => field.name);
    $.export("$summary", `Successfully retrieved ${names.length} column${names.length === 1
      ? ""
      : "s"}`);
    return names;
  },
};
