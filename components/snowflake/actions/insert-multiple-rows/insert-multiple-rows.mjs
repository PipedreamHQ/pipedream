import snowflake from "../../snowflake.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "action",
  key: "snowflake-insert-multiple-rows",
  name: "Insert Multiple Rows",
  description: "Insert multiple rows into a table",
  version: "0.1.2",
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
      description: "The table where you want to add rows",
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
    let rows = this.values;

    let inputValidated = true;

    if (!Array.isArray(rows)) {
      rows = JSON.parse(rows);
    }

    if (!rows || !rows.length || !Array.isArray(rows)) {
      inputValidated = false;
    } else {
      rows.forEach((row) => { if (!Array.isArray(row)) { inputValidated = false; } });
    }

    // Throw an error if input validation failed
    if (!inputValidated) {
      throw new ConfigurationError("The row data you passed is not an array of arrays. Please enter an array of arrays in the `Values` parameter above. If you're trying to add a single row to Snowflake, select the **Insert Single Row** action.");
    }

    const response = await this.snowflake.insertRows(this.tableName, this.columns, this.values);
    $.export("$summary", `Successfully inserted ${this.values.length} rows in ${this.tableName}`);
    return response;
  },
};
