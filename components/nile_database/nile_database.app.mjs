import pg from "pg";

export default {
  type: "app",
  app: "nile_database",
  methods: {
    async _getClient(config) {
      const pool = new pg.Pool(config);
      const client = await pool.connect();
      return client;
    },
    async _endClient(client) {
      return client.release();
    },
    async executeQuery(config, query) {
      const client = await this._getClient(config);
      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
      }
    },
  },
};
