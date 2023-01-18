import snowflake from "../../snowflake.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "snowflake-insert-row",
  name: "Insert Row",
  description: "Insert a row into a table",
  version: "0.1.0",
  props: {
    snowflake,
    tableName: {
      propDefinition: [
        snowflake,
        "tableName",
      ],
      description: "The name of the table to insert a new row",
    },
    columns: {
      propDefinition: [
        snowflake,
        "columns",
        (c) => ({
          tableName: c.tableName,
        }),
      ],
    },
    values: {
      propDefinition: [
        snowflake,
        "values",
      ],
    },
  },
  async run({ $ }) {
    if (this.columns.length !== this.values.length) {
      throw new ConfigurationError("`Columns` length is different than `Values` length");
    }

    const response = await this.snowflake.insertRow(this.tableName, this.columns, this.values);
    $.export("$summary", `Sucessfully inserted row to ${this.tableName} table`);
    return response;
  },
};
