import postgresql from "../../postgresql.app.mjs";
import { parseRowValues } from "../../common/utils.mjs";

export default {
  name: "Upsert Row",
  key: "postgresql-upsert-row",
  description: "Adds a new row or updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
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
    conflictTarget: {
      propDefinition: [
        postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
      label: "Conflict Target",
      description: "If insert fails, update the row with the same value in this column.",
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
      ],
      description: "JSON representation of your table row values. For example: `{ \"product_name\": \"Laptop Pro 15\", \"price\": 1200.50, \"stock_quantity\": 50 }`",
    },
  },
  async run({ $ }) {
    const {
      rowValues,
      ...args
    } = this;

    const parsedRowValues = parseRowValues(rowValues);

    const columns = Object.keys(parsedRowValues);
    const values = Object.values(parsedRowValues);

    const res = await this.postgresql.upsertRow({
      columns,
      values,
      errorMsg: "Row not upserted due to an error. ",
      ...args,
    });
    const summary = res
      ? "Row upserted"
      : "Row not upserted";
    $.export("$summary", summary);
    return res;
  },
};
