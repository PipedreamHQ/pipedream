import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Find Row",
  key: "postgresql-find-row",
  description: "Finds a row in a table via a lookup column. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.5",
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
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      column,
      value,
      rejectUnauthorized,
    } = this;
    try {
      const res = await this.postgresql.findRowByValue(
        schema,
        table,
        column,
        value,
        rejectUnauthorized,
      );
      const summary = res
        ? "Row found"
        : "Row not found";
      $.export("$summary", summary);
      return res;
    } catch (error) {
      throw new Error(`
      Row not retrieved due to an error. ${error}.
      This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
    `);
    }
  },
};
