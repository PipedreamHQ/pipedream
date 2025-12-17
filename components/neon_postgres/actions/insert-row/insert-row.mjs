import neon from "../../neon_postgres.app.mjs";
import { parseRowValues } from "../../common/utils.mjs";

export default {
  name: "Insert Row",
  key: "neon_postgres-insert-row",
  description: "Adds a new row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    neon,
    schema: {
      propDefinition: [
        neon,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        neon,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        neon,
        "rowValues",
      ],
      description: "JSON representation of your table rows. Accept a single row (JSON Object) or multiple rows (JSON array). For example: `{ \"product_id\": 1, \"product_name\": \"Laptop Pro 15\", \"price\": 1200.50, \"stock_quantity\": 50, \"created_at\": \"2023-10-26T10:00:00Z\" }`",
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      rowValues,
    } = this;
    const results = [];
    const parsedRowValues = parseRowValues(rowValues);
    const parsedRowValuesArray = Array.isArray(parsedRowValues)
      ? parsedRowValues
      : [
        parsedRowValues,
      ];

    const errorMsg = "New row(s) not inserted due to an error. ";

    for (const row of parsedRowValuesArray) {
      const columns = Object.keys(row);
      const values = Object.values(row);
      const res = await this.neon.insertRow(
        schema,
        table,
        columns,
        values,
        errorMsg,
      );
      results.push(res);
    }
    $.export("$summary", `Successfully inserted ${results.length} row${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
