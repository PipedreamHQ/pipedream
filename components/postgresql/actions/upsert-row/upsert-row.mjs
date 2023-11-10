import postgresql from "../../postgresql.app.mjs";
import format from "pg-format";

export default {
  name: "Upsert Row",
  key: "postgresql-upsert-row",
  description: "Adds a new row or updates an existing row. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.1",
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
    conflictTarget: {
      propDefinition: [
        postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
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
    },
  },
  methods: {
    /**
     * Upserts a row in a table.
     * @param {object} args - The parameters to the query.
     * @param {string} args.schema - The name of the schema.
     * @param {string} args.table - The name of the table.
     * @param {Array<string>} args.columns - The columns in which to insert values.
     * @param {Array<any>} args.values - The values to insert.
     * @param {string} args.conflictTarget - The column to use as the conflict target.
     * @param {boolean} args.rejectUnauthorized - If false, allows
     *  self-signed and invalid SSL certificates.
     * @returns {Promise<object>} A promise that resolves with the result of the query.
     * @throws {Error} Will throw an error if the query fails.
     */
    upsertRow({
      schema, table, columns, values, conflictTarget = "id", rejectUnauthorized,
    } = {}) {
      const placeholders = this.postgresql.getPlaceholders({
        values,
      });

      const updates =
        columns
          .filter((column) => column !== conflictTarget)
          .map((column) => `${column}=EXCLUDED.${column}`);

      const query = `
        INSERT INTO ${schema}.${table} (${columns})
          VALUES (${placeholders})
          ON CONFLICT (${conflictTarget})
          DO UPDATE SET ${updates}
          RETURNING *
      `;

      return this.postgresql.executeQuery({
        text: format(query, schema, table),
        values,
      }, rejectUnauthorized);
    },
  },
  async run({ $ }) {
    const {
      upsertRow,
      rowValues,
      ...args
    } = this;

    const columns = Object.keys(rowValues);
    const values = Object.values(rowValues);

    try {
      const res = await upsertRow({
        columns,
        values,
        ...args,
      });
      const summary = res
        ? "Row upserted"
        : "Row not upserted";
      $.export("$summary", summary);
      return res;
    } catch (error) {
      throw new Error(`
        Row not upserted due to an error. ${error}.
        This could be because SSL verification failed, consider changing the Reject Unauthorized prop and try again.
      `);
    }
  },
};
