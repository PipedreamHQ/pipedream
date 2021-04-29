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
        await this.closeConnection(connection);
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
    async closeConnection(connection) {
      const connectionClosed = new Promise((resolve) => {
        connection.connection.stream.on("close", resolve);
      });
      await connection.end();
      await connectionClosed;
    },
    async executeQuery(connection, query) {
      const results = await connection.execute(query);
      return results[0];
    },
    async listTables(connection) {
      const options = {
        sql: "SHOW FULL TABLES",
      };
      return await this.executeQuery(connection, options);
    },
    async listBaseTables(connection, lastResult) {
      const options = {
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_TYPE = 'BASE TABLE'
          AND CREATE_TIME > ?
          ORDER BY CREATE_TIME DESC
        `,
        values: [lastResult],
      };
      return await this.executeQuery(connection, options);
    },
    async listTopTables(connection, maxCount = 10) {
      const options = {
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
          WHERE TABLE_TYPE = 'BASE TABLE'
          ORDER BY CREATE_TIME DESC
          LIMIT ?
        `,
        values: [maxCount],
      };
      return await this.executeQuery(connection, options);
    },
    async listColumns(connection, table) {
      const options = {
        sql: `SHOW COLUMNS FROM \`${table}\``,
      };
      return await this.executeQuery(connection, options);
    },
    async listNewColumns(connection, table, previousColumns) {
      const options = {
        sql: `
          SHOW COLUMNS FROM \`${table}\`
          WHERE Field NOT IN (?)
        `,
        values: [previousColumns.join()],
      };
      return await this.executeQuery(connection, options);
    },
    /**
     * Returns rows from a specified table.
     * @param {object} connection - The database connection.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     * @param {string} lastResult - Maximum result in the specified table column that has been previously returned.
     */
    async listRows(connection, table, column, lastResult) {
      const options = {
        sql: `
          SELECT * FROM \`${table}\`
          WHERE \`${column}\` > ? 
          ORDER BY \`${column}\` DESC
        `,
        values: [lastResult],
      };
      return await this.executeQuery(connection, options);
    },
    /**
     * Returns rows from a specified table. Used when lastResult has not yet been set. Returns a maximum of 10 results
     * ordered by the specified column.
     * @param {object} connection - The database connection.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     */
    async listMaxRows(connection, table, column, maxCount = 10) {
      const options = {
        sql: `
          SELECT * FROM \`${table}\`
          ORDER BY \`${column}\` DESC
          LIMIT ?
        `,
        values: [maxCount],
      };
      return await this.executeQuery(connection, options);
    },
    async getPrimaryKey(connection, table) {
      const options = {
        sql: `SHOW KEYS FROM ? WHERE Key_name = 'PRIMARY'`,
        values: [table],
      };
      return await this.executeQuery(connection, options);
    },
    async listColumnNames(table) {
      const connection = await this.getConnection();
      const columns = await this.listColumns(connection, table);
      await this.closeConnection(connection);
      return columns.map((column) => column.Field);
    },
  },
};