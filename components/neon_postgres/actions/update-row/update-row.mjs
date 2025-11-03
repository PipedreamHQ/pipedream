import neon from "../../neon_postgres.app.mjs";
import { parseRowValues } from "../../common/utils.mjs";

export default {
  name: "Update Row",
  key: "neon_postgres-update-row",
  description: "Updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    column: {
      propDefinition: [
        neon,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
      label: "Lookup Column",
      description: "Find row to update by searching for a value in this column. Returns first row found",
    },
    value: {
      propDefinition: [
        neon,
        "value",
        (c) => ({
          table: c.table,
          column: c.column,
          schema: c.schema,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        neon,
        "rowValues",
      ],
      description: "JSON representation of your new table row values. For example: `{ \"product_name\": \"Laptop Pro 15\", \"price\": 1200.50, \"stock_quantity\": 50 }`",
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      column,
      value,
      rowValues,
    } = this;

    const parsedRowValues = parseRowValues(rowValues);
    const errorMsg = "Row not updated due to an error. ";

    const res = await this.neon.updateRow(
      schema,
      table,
      column,
      value,
      parsedRowValues,
      errorMsg,
    );
    const summary = res
      ? "Row updated"
      : "Row not found";
    $.export("$summary", summary);
    return res;
  },
};
