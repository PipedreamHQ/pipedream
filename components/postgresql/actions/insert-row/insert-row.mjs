import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Insert Row",
  key: "postgresql-insert-row",
  description: "Adds a new row. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.7",
  type: "action",
  props: {
    postgresql,
    rejectUnauthorized: {
      propDefinition: [
        postgresql,
        "rejectUnauthorized",
      ],
    },
    schema: {
      propDefinition: [
        postgresql,
        "schema",
        (c) => ({
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    table: {
      propDefinition: [
        postgresql,
        "table",
        (c) => ({
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      schema,
      table,
      rowValues,
      rejectUnauthorized,
    } = this;
    const columns = Object.keys(rowValues);
    const values = Object.values(rowValues);
    try {
      const res = await this.postgresql.insertRow(
        schema,
        table,
        columns,
        values,
        rejectUnauthorized,
      );
      $.export("$summary", "New row inserted");
      return res;
    } catch (error) {
      throw new Error(`
        New row not inserted due to an error. ${error}.
        This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
      `);
    }
  },
};
