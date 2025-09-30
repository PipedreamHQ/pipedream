import postgresql from "../../postgresql.app.mjs";
import { parseRowValues } from "../../common/utils.mjs";

export default {
  name: "Update Row",
  key: "postgresql-update-row",
  description: "Updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postgresql,
    schema: {
      propDefinition: [
        postgresql,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        postgresql,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    column: {
      propDefinition: [
        postgresql,
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
        postgresql,
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
        postgresql,
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

    const res = await this.postgresql.updateRow(
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
