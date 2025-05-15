import neon from "../../neon_postgres.app.mjs";
import format from "pg-format";

export default {
  name: "Upsert Row",
  key: "neon_postgres-upsert-row",
  description: "Adds a new row or updates an existing row. [See the documentation](https://node-postgres.com/features/queries)",
  version: "0.0.1",
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
    conflictTarget: {
      propDefinition: [
        neon,
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
        neon,
        "rowValues",
      ],
    },
  },
  methods: {
    upsertRow({
      schema, table, columns, values, conflictTarget = "id",
    } = {}) {
      const placeholders = this.neon.getPlaceholders({
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

      return this.neon.executeQuery({
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
