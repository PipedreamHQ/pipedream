import pg from "pg";

export default {
  type: "app",
  app: "nile_database",
  methods: {
    getClientConfiguration() {
      const {
        username,
        password,
        host,
        port,
        database,
      } = this.$auth;

      return {
        user: username,
        password,
        host,
        port,
        database,
      };
    },
    async _getClient() {
      const config = this.getClientConfiguration();
      const pool = new pg.Pool(config);
      const client = await pool.connect();
      return client;
    },
    async _endClient(client) {
      return client.release();
    },
    async executeQuery(query) {
      const client = await this._getClient();

      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
      }
    },
    executeQueryAdapter(proxyArgs = {}) {
      const {
        query: text = "",
        params: values = [],
      } = proxyArgs;
      return {
        text,
        values,
      };
    },
    proxyAdapter(query) {
      if (typeof query === "string") {
        return {
          query,
        };
      }

      return {
        query: query.text,
        params: query.values,
      };
    },
    async getSchema() {
      const text = `
        SELECT table_name AS "tableName",
          column_name AS "columnName",
          is_nullable AS "isNullable",
          data_type AS "dataType",
          column_default AS "columnDefault"
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'users', 'auth')
        ORDER BY table_name,
          ordinal_position
      `;
      const rows = await this.executeQuery({
        text,
      });
      return rows.reduce((acc, row) => {
        acc[row.tableName] ??= {
          metadata: {},
          schema: {},
        };
        acc[row.tableName].schema[row.columnName] = {
          ...row,
        };
        return acc;
      }, {});
    },
  },
};
