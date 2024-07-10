import snowflake from "../../snowflake.app.mjs";

export default {
  type: "action",
  key: "snowflake-insert-row",
  name: "Insert Single Row",
  description: "Insert a row into a table",
  version: "1.1.2",
  props: {
    snowflake,
    database: {
      propDefinition: [
        snowflake,
        "database",
      ],
    },
    schema: {
      propDefinition: [
        snowflake,
        "schema",
        (c) =>  ({
          database: c.database,
        }),
      ],
    },
    tableName: {
      propDefinition: [
        snowflake,
        "tableName",
        (c) => ({
          database: c.database,
          schema: c.schema,
        }),
      ],
      description: "The table where you want to add a new row",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    // Once a user selects the table, display the columns as additional props
    if (this.tableName) {
      const fields = await this.snowflake.listFieldsForTable(this.tableName);
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
    const response = await this.snowflake.insertRow(this.tableName, this.values);
    $.export("$summary", `Successfully inserted row in ${this.tableName}`);
    return response;
  },
};
