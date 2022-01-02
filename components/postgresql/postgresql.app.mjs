import pg from "pg";

export default {
  type: "app",
  app: "postgresql",
  propDefinitions: {},
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
    async getTables(client) {
      const { rows } = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      return rows;
    },
  },
};
