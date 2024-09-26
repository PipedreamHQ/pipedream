import postgresql from "../../postgresql.app.mjs";
import format from "pg-format";

export default {
  name: "Upsert Row",
  key: "postgresql-upsert-row",
  description: "Adds a new row or updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.6",
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
     * @returns {Promise<object>} A promise that resolves with the result of the query.
     * @throws {Error} Will throw an error if the query fails.
     */
    upsertRow({
      schema, table, columns, values, conflictTarget = "id",
    } = {}) {
      const placeholders = this.postgresql.getPlaceholders({
        values,
      });

      const updates = columns
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
      });
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
      let errorMsg = "Row not upserted due to an error. ";
      errorMsg += `${error}`.includes("SSL verification failed")
        ? "This could be because SSL verification failed. To resolve this, reconnect your account and set SSL Verification Mode: Skip Verification, and try again."
        : `${error}`;
      throw new Error(errorMsg);
    }
  },
};
