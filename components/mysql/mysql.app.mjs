import mysqlClient from "mysql2/promise";

export default {
  type: "app",
  app: "mysql",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "The database table to watch for changes",
      async options() {
        const { database } = this.$auth;
        const tables = await this.listTables();
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
      async options({ table }) {
        return this.listColumnNames(table);
      },
    },
    whereCondition: {
      type: "string",
      label: "Where condition",
      description: "In this **expression** you can write your own conditions (eg. `column1 = ? or column2 = ?`). Depending on the number of `?` symbols likewise you need to add the same number of **values**.",
    },
    whereValues: {
      type: "string[]",
      label: "Values",
      description: "This is the list of **values** that will match every `?` symbol in the **where expression**. If you want to build yourself the **values** (eg. `{{[\"string1\", \"string2\"]}}`)",
    },
    whereOperator: {
      type: "string",
      label: "Where Operator",
      description: "Build a filter based on this operator (eg. `=, >, >=, <, !=, <=, LIKE`).",
      options() {
        return [
          {
            label: "Equal to",
            value: "=",
          },
          {
            label: "Greater than",
            value: ">",
          },
          {
            label: "Greater than or equal to",
            value: ">=",
          },
          {
            label: "Less than",
            value: "<",
          },
          {
            label: "Not equal to",
            value: "!=",
          },
          {
            label: "Less than or equal to",
            value: "<=",
          },
          {
            label: "Simple pattern matching",
            value: "like",
          },
        ];
      },
    },
    whereValue: {
      type: "string",
      label: "Value",
      description: "This is the value to be set after the selected operator",
    },
    storedProcedure: {
      type: "string",
      label: "Stored Procedure",
      description: "List of stored procedures in the current database",
      async options({ rejectUnauthorized }) {
        return this.listStoredProcedures(rejectUnauthorized);
      },
    },
    storedProcedureParameters: {
      type: "string[]",
      label: "Parameters",
      description: "Parameters for the stored procedure",
      optional: true,
    },
    rejectUnauthorized: {
      type: "boolean",
      label: "Reject Unauthorized",
      description: "If not false, the server certificate is verified against the list of supplied CAs. If you get an error about SSL try to set this prop as `false`",
      default: false,
      optional: true,
    },
  },
  methods: {
    async getConnection({ rejectUnauthorized } = {}) {
      const {
        host,
        port,
        username,
        password,
        database,
      } = this.$auth;
      console.log(rejectUnauthorized);
      return mysqlClient.createConnection({
        host,
        port,
        user: username,
        password,
        database,
        ssl: {
          rejectUnauthorized: rejectUnauthorized ?? false,
        },
      });
    },
    async closeConnection(connection) {
      const connectionClosed = new Promise((resolve) => {
        connection.connection.stream.on("close", resolve);
      });
      await connection.end();
      await connectionClosed;
    },
    async executeQuery({
      connection, preparedStatement,
    }) {
      const [
        result,
      ] = await connection.execute(preparedStatement);
      return result;
    },
    async executeQueryConnectionHandler(preparedStatement, rejectUnauthorized = false) {
      let connection;

      try {
        connection = await this.getConnection({
          rejectUnauthorized,
        });

        return await this.executeQuery({
          connection,
          preparedStatement,
        });

      } finally {
        if (connection) {
          await this.closeConnection(connection);
        }
      }
    },
    async listStoredProcedures(rejectUnauthorized) {
      const preparedStatement = {
        sql: "SHOW PROCEDURE STATUS",
      };

      const procedures = await this.executeQueryConnectionHandler(preparedStatement,
        rejectUnauthorized);

      return procedures.map(({
        Db: db, Name: name,
      }) => {
        const procedure = `${db}.${name}`;
        return {
          label: procedure,
          value: procedure,
        };
      });
    },
    async listTables(rejectUnauthorized) {
      const preparedStatement = {
        sql: "SHOW FULL TABLES",
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async listBaseTables(lastResult, rejectUnauthorized) {
      const preparedStatement = {
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            AND CREATE_TIME > ?
            ORDER BY CREATE_TIME DESC
        `,
        values: [
          lastResult,
        ],
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async listTopTables(maxCount = 10, rejectUnauthorized) {
      const preparedStatement = {
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY CREATE_TIME DESC
            LIMIT ${maxCount}
        `,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async listColumns(table, rejectUnauthorized) {
      const preparedStatement = {
        sql: `SHOW COLUMNS FROM \`${table}\``,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async listNewColumns(table, previousColumns, rejectUnauthorized) {
      const preparedStatement = {
        sql: `
          SHOW COLUMNS FROM \`${table}\`
          WHERE Field NOT IN (?)
        `,
        values: [
          previousColumns.join(),
        ],
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    /**
     * Returns rows from a specified table.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     * @param {string} lastResult - Maximum result in the specified table column
     * that has been previously returned.
     */
    async listRows(table, column, lastResult, rejectUnauthorized) {
      const preparedStatement = {
        sql: `
          SELECT * FROM \`${table}\`
          WHERE \`${column}\` > ? 
          ORDER BY \`${column}\` DESC
        `,
        values: [
          lastResult,
        ],
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    /**
     * Returns rows from a specified table. Used when lastResult has not yet been set.
     * Returns a maximum of 10 results
     * ordered by the specified column.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     */
    async listMaxRows(table, column, maxCount = 10, rejectUnauthorized) {
      const preparedStatement = {
        sql: `
          SELECT * FROM \`${table}\`
            ORDER BY \`${column}\` DESC
            LIMIT ${maxCount}
        `,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async getPrimaryKey(table, rejectUnauthorized) {
      const preparedStatement = {
        sql: "SHOW KEYS FROM ? WHERE Key_name = 'PRIMARY'",
        values: [
          table,
        ],
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async listColumnNames(table, rejectUnauthorized) {
      const columns = await this.listColumns(table, rejectUnauthorized);
      return columns.map((column) => column.Field);
    },
    async findRows({
      table, condition, values = [], rejectUnauthorized,
    }) {
      const preparedStatement = {
        sql: `SELECT * FROM \`${table}\` WHERE ${condition}`,
        values,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async deleteRows({
      table, condition, values = [], rejectUnauthorized,
    }) {
      const preparedStatement = {
        sql: `DELETE FROM \`${table}\` WHERE ${condition}`,
        values,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async insertRow({
      table, columns = [], values = [], rejectUnauthorized,
    }) {
      const placeholder = values.map(() => "?").join(",");
      const preparedStatement = {
        sql: `
          INSERT INTO \`${table}\` (${columns.join(",")})
            VALUES (${placeholder})
        `,
        values,
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async updateRow({
      table, condition, conditionValues = [], columnsToUpdate = [], valuesToUpdate = [],
      rejectUnauthorized,
    }) {
      const updates =
        columnsToUpdate
          .map((column) => `\`${column}\` = ?`);

      const preparedStatement = {
        sql: `
          UPDATE \`${table}\`
            SET ${updates}
            WHERE ${condition}`,
        values: [
          ...valuesToUpdate,
          ...conditionValues,
        ],
      };
      return this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
    },
    async executeStoredProcedure({
      storedProcedure, values = [], rejectUnauthorized,
    }) {
      const preparedStatement = {
        sql: `CALL ${storedProcedure}(${values.map(() => "?")})`,
        values,
      };
      const [
        result,
      ] = await this.executeQueryConnectionHandler(preparedStatement, rejectUnauthorized);
      return result;
    },
  },
};
