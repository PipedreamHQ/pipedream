import postgresql from "../../postgresql.app.mjs";

export default {
  name: "Create Row",
  key: "postgresql-create-row",
  description: "Adds a new row. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.1.4",
  type: "action",
  props: {
    postgresql,
    table: {
      propDefinition: [
        postgresql,
        "table",
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
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
      table,
      rowValues,
      rejectUnauthorized,
    } = this;
    const columns = Object.keys(rowValues);
    const values = Object.values(rowValues);
    try {
      const res = await this.postgresql.insertRow(table, columns, values, rejectUnauthorized);
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
