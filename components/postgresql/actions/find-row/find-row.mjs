import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Find Row",
  key: "postgresql-find-row",
  description: "Finds a row in a table via a lookup column. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "Find row by searching for a value in this column. Returns first row found",
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
  },
  async run({ $ }) {
    const {
      schema,
      table,
      column,
      value,
    } = this;

    const errorMsg = "Row not found due to an error. ";

    const res = await this.postgresql.findRowByValue(
      schema,
      table,
      column,
      value,
      errorMsg,
    );
    const summary = res
      ? "Row found"
      : "Row not found";
    $.export("$summary", summary);
    return res;
  },
};
