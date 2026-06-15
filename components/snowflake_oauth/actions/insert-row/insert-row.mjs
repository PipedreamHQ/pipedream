import snowflake from "../../snowflake_oauth.app.mjs";

export default {
  type: "action",
  key: "snowflake_oauth-insert-row",
  name: "Insert Single Row",
  description: "Insert a row into a table. [See the documentation](https://docs.snowflake.com/en/sql-reference/sql/insert)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The fully-qualified table where you want to add a new row, in `database.schema.table` form. Run the **List Tables** action first to find it. Column value fields appear after you enter a table.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.tableName) {
      const fields = await this.snowflake.listFieldsForTable(this.tableName);
      const defaultValue = {};
      for (const field of fields) {
        defaultValue[field.name] = "";
      }
      props.values = {
        type: "object",
        label: "Values",
        description: "Enter the values for each column",
        default: defaultValue,
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.snowflake.insertRow(this.tableName, this.values);
    $.export("$summary", `Successfully inserted row in ${this.tableName}`);
    return response;
  },
};
