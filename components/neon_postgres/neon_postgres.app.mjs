import postgresql from "@pipedream/postgresql";
import format from "pg-format";

export default {
  type: "app",
  app: "neon_postgres",
  propDefinitions: {
    ...postgresql.propDefinitions,
  },
  methods: {
    ...postgresql.methods,
    getClientConfiguration() {
      const {
        host,
        port,
        user,
        password,
        database,
      } = this.$auth;

      return {
        host,
        port,
        user,
        password,
        database,
        ssl: this._getSslConfig(),
      };
    },
    upsertRow({
      schema, table, columns, values, conflictTarget = "id", errorMsg,
    } = {}) {
      const placeholders = this.getPlaceholders({
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

      return this.executeQuery({
        text: format(query, schema, table),
        values,
        errorMsg,
      });
    },
  },
};
