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
        return this.listColumnNames({
          table,
        });
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
      async options({
        rejectUnauthorized = false, ca, key, cert,
      }) {
        return this.listStoredProcedures({
          ssl: {
            rejectUnauthorized,
            ca,
            key,
            cert,
          },
        });
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
    ca: {
      type: "string",
      label: "Certificate Authority",
      description: "The CA text to use for the connection. E.g. (`-----BEGIN CERTIFICATE-----\\nMIIDBTCCAe2gAwIBAgIJA...`).",
      optional: true,
    },
    key: {
      type: "string",
      label: "Private Key",
      description: "The key text to use for the connection. E.g. (`-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQ...`).",
      optional: true,
    },
    cert: {
      type: "string",
      label: "Certificate",
      description: "The certificate text to use for the connection. E.g. (`-----BEGIN CERTIFICATE-----\\nMIIDBTCCAe2gAwIBAgIJA...`).",
      optional: true,
    },
  },
  methods: {
    async getConnection({
      ssl, ...args
    } = {}) {
      const {
        host,
        port,
        username,
        password,
        database,
        ca,
        key,
        cert,
      } = this.$auth;
      const config = {
        debug: true,
        host,
        port,
        user: username,
        password,
        database,
        ssl: {
          rejectUnauthorized: ssl?.rejectUnauthorized ?? false,
          ca: ssl?.rejectUnauthorized && ca || ssl?.ca,
          key: ssl?.rejectUnauthorized && key || ssl?.key,
          cert: ssl?.rejectUnauthorized && cert || ssl?.cert,
        },
        ...args,
      };
      return mysqlClient.createConnection(config);
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
    async executeQueryConnectionHandler({
      preparedStatement, ...args
    } = {}) {
      let connection;

      try {
        connection = await this.getConnection(args);

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
    async listStoredProcedures(args = {}) {
      const procedures = await this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: "SHOW PROCEDURE STATUS",
        },
        ...args,
      });

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
    listTables(args = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: "SHOW FULL TABLES",
        },
        ...args,
      });
    },
    listBaseTables({
      lastResult, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            SELECT * FROM INFORMATION_SCHEMA.TABLES 
              WHERE TABLE_TYPE = 'BASE TABLE'
              AND CREATE_TIME > ?
              ORDER BY CREATE_TIME DESC
          `,
          values: [
            lastResult,
          ],
        },
        ...args,
      });
    },
    listTopTables({
      maxCount = 10, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            SELECT * FROM INFORMATION_SCHEMA.TABLES 
              WHERE TABLE_TYPE = 'BASE TABLE'
              ORDER BY CREATE_TIME DESC
              LIMIT ${maxCount}
          `,
        },
        ...args,
      });
    },
    listColumns({
      table, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `SHOW COLUMNS FROM \`${table}\``,
        },
        ...args,
      });
    },
    listNewColumns({
      table, previousColumns, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            SHOW COLUMNS FROM \`${table}\`
            WHERE Field NOT IN (?)
          `,
          values: [
            previousColumns?.join(),
          ],
        },
        ...args,
      });
    },
    /**
     * Returns rows from a specified table.
     * @param {object} args - Arguments object to pass to the method.
     * @param {string} args.table - Name of the table to search.
     * @param {string} args.column - Name of the table column to order by
     * @param {string} args.lastResult - Maximum result in the specified table column
     * that has been previously returned.
     */
    listRows({
      table, column, lastResult, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            SELECT * FROM \`${table}\`
            WHERE \`${column}\` > ? 
            ORDER BY \`${column}\` DESC
          `,
          values: [
            lastResult,
          ],
        },
        ...args,
      });
    },
    /**
     * Returns rows from a specified table. Used when lastResult has not yet been set.
     * Returns a maximum of 10 results
     * ordered by the specified column.
     * @param {object} args - Arguments object to pass to the method.
     * @param {string} table - Name of the table to search.
     * @param {string} column - Name of the table column to order by
     * @param {number} maxCount - Maximum number of results to return.
     */
    listMaxRows({
      table, column, maxCount = 10, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            SELECT * FROM \`${table}\`
              ORDER BY \`${column}\` DESC
              LIMIT ${maxCount}
          `,
        },
        ...args,
      });
    },
    getPrimaryKey({
      table, ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: "SHOW KEYS FROM ? WHERE Key_name = 'PRIMARY'",
          values: [
            table,
          ],
        },
        ...args,
      });
    },
    async listColumnNames({
      table, ...args
    } = {}) {
      const columns = await this.listColumns({
        table,
        ...args,
      });
      return columns.map((column) => column.Field);
    },
    findRows({
      table, condition, values = [], ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `SELECT * FROM \`${table}\` WHERE ${condition}`,
          values,
        },
        ...args,
      });
    },
    deleteRows({
      table, condition, values = [], ...args
    } = {}) {
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `DELETE FROM \`${table}\` WHERE ${condition}`,
          values,
        },
        ...args,
      });
    },
    insertRow({
      table, columns = [], values = [], ...args
    } = {}) {
      const placeholder = values.map(() => "?").join(",");
      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            INSERT INTO \`${table}\` (${columns.join(",")})
              VALUES (${placeholder})
          `,
          values,
        },
        ...args,
      });
    },
    updateRow({
      table, condition,
      conditionValues = [], columnsToUpdate = [], valuesToUpdate = [],
      ...args
    } = {}) {
      const updates =
        columnsToUpdate
          .map((column) => `\`${column}\` = ?`);

      return this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `
            UPDATE \`${table}\`
              SET ${updates}
              WHERE ${condition}`,
          values: [
            ...valuesToUpdate,
            ...conditionValues,
          ],
        },
        ...args,
      });
    },
    async executeStoredProcedure({
      storedProcedure, values = [], ...args
    } = {}) {
      const [
        result,
      ] = await this.executeQueryConnectionHandler({
        preparedStatement: {
          sql: `CALL ${storedProcedure}(${values.map(() => "?")})`,
          values,
        },
        ...args,
      });
      return result;
    },
  },
};
