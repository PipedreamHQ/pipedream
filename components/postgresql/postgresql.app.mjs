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
    async getTables() {
      const client = await this.getClient();
      const { rows } = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      await this.endClient(client);
      return rows.map((row) => row.table_name);
    },
    async getColumns(table) {
      const client = await this.getClient();
      const { rows } = await client.query(`SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
      await this.endClient(client);
      return rows.map((row) => row.column_name);
    },
  },
};
