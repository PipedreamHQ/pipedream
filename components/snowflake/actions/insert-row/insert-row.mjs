import snowflake from "../../snowflake.app.mjs";

export default {
  type: "action",
  key: "snowflake-insert-row",
  name: "Insert Single Row",
  description: "Insert a row into a table",
  version: "1.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    snowflake,
    database: {
      type: "string",
      label: "Database",
      description: "The database to use. Run **List Database Options** to find available databases.",
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to use. Run **List Schema Options** to find available schemas.",
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The table where you want to add a new row. Run **List Table Options** to find available tables.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    // Once a user provides the table, display the columns as additional props
    if (this.database && this.schema && this.tableName) {
      const tableName = `${this.database}.${this.schema}.${this.tableName}`;
      const fields = await this.snowflake.listFieldsForTable(tableName);
      const defaultValue = {};
      for (const field of fields) {
        defaultValue[field.name] = "";
      }
      props["values"] = {
        type: "object",
        label: "Values",
        description: "Enter the values for each column",
        default: defaultValue,
      };
    }
    return props;
  },
  async run({ $ }) {
    const tableName = `${this.database}.${this.schema}.${this.tableName}`;
    const response = await this.snowflake.insertRow(tableName, this.values);
    $.export("$summary", `Successfully inserted row in ${tableName}`);
    return response;
  },
};
