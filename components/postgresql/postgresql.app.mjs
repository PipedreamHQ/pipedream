import pg from "pg";

export default {
  type: "app",
  app: "postgresql",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "Database table",
      async options() {
        return this.getTables();
      },
    },
    column: {
      type: "string",
      label: "Column",
      description: "The name of a column in the table to use for deduplication. Defaults to the table's primary key",
      async options({ table }) {
        return this.getColumns(table);
      },
    },
    query: {
      type: "string",
      label: "SQL Query",
      description: "Your custom SQL query",
    },
  },
  methods: {
    async getClient() {
      const { Client } = pg;
      const {
        user,
        password,
        host,
        port,
        database,
      } = this.$auth;
      const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
      const client = new Client({
        connectionString,
      });
      await client
        .connect()
        .then(() => console.log("Successfully connected to database"))
        .catch((err) => console.error("Connection error", err.stack));
      return client;
    },
    async endClient(client) {
      client.end();
    },
    async executeQuery(query) {
      const client = await this.getClient();
      const { rows } = await client.query(query);
      await this.endClient(client);
      return rows;
    },
    async getTables() {
      const rows = await this.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      return rows.map((row) => row.table_name);
    },
    async getColumns(table) {
      const rows = await this.executeQuery(`SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
      return rows.map((row) => row.column_name);
    },
    async getPrimaryKey(table) {
      const rows = await this.executeQuery(`SELECT a.attname FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = '${table}'::regclass AND i.indisprimary`);
      return rows[0].attname;
    },
    async getRows(table, column, lastResult = null) {
      const query = `SELECT * FROM ${table} ${lastResult
        ? "WHERE " + column + ">" + lastResult
        : ""} ORDER BY ${column} DESC`;
      const { rows } = await this.executeQuery(query);
      return rows;
    },
  },
};
