const mysqlClient = require("mysql2/promise");

module.exports = {
  type: "app",
  app: "mysql",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "The database table to watch for changes",
      async options() {
        const { database } = this.$auth;
        const connection = await this.getConnection();
        const tables = await this.listTables(connection);
        connection.end();
        return tables.map((table) => {
          return table[`Tables_in_${database}`];
        });
      },
    },
    column: {
      type: "string",
      label: "Column",
      description:
        "The name of a column in the table to use for deduplication. Defaults to the table's primary key",
      async options(opts) {
        return this.listColumnNames(opts.table);
      },
    },
    query: {
      type: "string",
      label: "SQL Query",
      description: "Your custom SQL query",
    },
  },
  methods: {
    async getConnection() {
      const { host, port, username, password, database } = this.$auth;
      return await mysqlClient.createConnection({
        host,
        port,
        user: username,
        password,
        database,
      });
    },
    async executeQuery(connection, query) {
      const results = await connection.execute(query);
      return results[0];
    },
    async listTables(connection) {
      return await this.executeQuery(connection, "SHOW FULL TABLES");
    },
    async listColumns(connection, table) {
      return await this.executeQuery(connection, `SHOW COLUMNS FROM ${table}`);
    },
    /**
     * Returns rows from a specified table.
     * @param {object} connection - The database connection.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     * @param {string} lastResult - Maximum result in the specified table column that has been previously returned.
     */
    async listRows(connection, table, column, lastResult) {
      let query = `SELECT * FROM ${table} WHERE ${column} > `;
      if (typeof lastResult == "string") query += `'${lastResult}'`;
      else query += lastResult;
      query += ` ORDER BY ${column} DESC`;
      return await this.executeQuery(connection, query);
    },
    /**
     * Returns rows from a specified table. Used when lastResult has not yet been set. Returns a maximum of 10 results
     * ordered by the specified column.
     * @param {object} connection - The database connection.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     */
    async listMax10Rows(connection, table, column) {
      const query = `SELECT * FROM ${table} ORDER BY ${column} DESC LIMIT 10`;
      return await this.executeQuery(connection, query);
    },
    async getPrimaryKey(connection, table) {
      return await this.executeQuery(
        connection,
        `SHOW KEYS FROM ${table} WHERE Key_name = 'PRIMARY'`
      );
    },
    async listColumnNames(table) {
      const connection = await this.getConnection();
      const columns = await this.listColumns(connection, table);
      connection.end();
      return columns.map((column) => {
        return column.Field;
      });
    },
  },
};