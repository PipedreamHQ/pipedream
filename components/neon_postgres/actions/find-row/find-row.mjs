import neon from "../../neon_postgres.app.mjs";

export default {
  name: "Find Row",
  key: "neon_postgres-find-row",
  description: "Finds a row in a table via a lookup column. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      description: "Find row by searching for a value in this column. Returns first row found",
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
  },
  async run({ $ }) {
    const {
      schema,
      table,
      column,
      value,
    } = this;

    const errorMsg = "Row not found due to an error. ";

    const res = await this.neon.findRowByValue(
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
