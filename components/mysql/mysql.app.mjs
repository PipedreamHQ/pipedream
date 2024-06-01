import mysqlClient from "mysql2/promise";
import {
  sqlProxy,
  sqlProp,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

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
      async options() {
        return this.listStoredProcedures();
      },
    },
    storedProcedureParameters: {
      type: "string[]",
      label: "Parameters",
      description: "Parameters for the stored procedure",
      optional: true,
    },
  },
  methods: {
    ...sqlProxy.methods,
    ...sqlProp.methods,
    _getSslConfig() {
      const {
        ca,
        key,
        cert,
        ssl_verification_mode: mode,
      } = this.$auth;

      const defaultConfig = {
        ...(ca && {
          rejectUnauthorized: true,
          verifyIdentity: true,
        }),
      };

      const sslConfg = constants.SSL_CONFIG[mode] || defaultConfig;

      const ssl = {
        ...(ca && {
          ca,
        }),
        ...(key && {
          key,
        }),
        ...(cert && {
          cert,
        }),
        ...sslConfg,
      };

      return Object.keys(ssl).length > 0
        ? ssl
        : undefined;
    },
    /**
     * A helper method to get the configuration object that's directly fed to
     * the MySQL client constructor. Used by other features (like the SQL proxy)
     * to initialize their clients in an identical way.
     *
     * @returns {object} - Configuration object for the MySQL client
     */
    getClientConfiguration() {
      const {
        host,
        port,
        username: user,
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
    /**
     * Adapts the arguments to `executeQuery` so that they can be consumed by
     * the SQL proxy (when applicable). Note that this method is not intended to
     * be used by the component directly.
     * @param {object} preparedStatement The prepared statement to be sent to the DB.
     * @param {string} preparedStatement.sql The prepared SQL query to be executed.
     * @param {string[]} preparedStatement.values The values to replace in the SQL query.
     * @returns {object} - The adapted query and parameters.
     */
    proxyAdapter(preparedStatement = {}) {
      const {
        sql: query = "",
        values: params = [],
      } = preparedStatement;
      return {
        query,
        params,
      };
    },
    /**
     * A method that performs the inverse transformation of `proxyAdapter`.
     *
     * @param {object} proxyArgs - The output of `proxyAdapter`.
     * @param {string} proxyArgs.query - The SQL query to be executed.
     * @param {string[]} proxyArgs.params - The values to replace in the SQL
     * query.
     * @returns {object} - The adapted query and parameters, compatible with
     * `executeQuery`.
     */
    executeQueryAdapter(proxyArgs = {}) {
      const {
        query: sql = "",
        params: values = [],
      } = proxyArgs;
      return {
        sql,
        values,
      };
    },
    /**
     * Executes a query against the MySQL database. This method takes care of
     * connecting to the database, executing the query, and closing the
     * connection.
     * @param {object} preparedStatement - The prepared statement to be sent to the DB.
     * @param {string} preparedStatement.sql - The prepared SQL query to be executed.
     * @param {string[]} preparedStatement.values - The values to replace in the SQL query.
     * @returns {object[]} - The rows returned by the DB as a result of the query.
     */
    async executeQuery(preparedStatement = {}) {
      const config = this.getClientConfiguration();
      let connection;
      try {
        connection = await mysqlClient.createConnection(config);
        const [
          rows,
        ] = await connection.execute(preparedStatement);
        return rows;

      } catch (error) {
        console.log("Error executing query", error);
        throw error;

      } finally {
        if (connection) {
          await this._closeConnection(connection);
        }
      }
    },
    /**
     * A helper method to get the schema of the database. Used by other features
     * (like the `sql` prop) to enrich the code editor and provide the user with
     * auto-complete and fields suggestion.
     *
     * @returns {DbInfo} The schema of the database, which is a
     * JSON-serializable object.
     */
    async getSchema() {
      const sql = `
        SELECT t.table_schema AS tableSchema,
            t.table_name AS tableName,
            CAST(t.table_rows AS UNSIGNED) AS rowCount,
            c.column_name AS columnName,
            c.data_type AS dataType,
            c.is_nullable AS isNullable,
            c.column_default AS columnDefault
        FROM information_schema.tables AS t
            JOIN information_schema.columns AS c ON t.table_name = c.table_name
            AND t.table_schema = c.table_schema
        WHERE t.table_schema = ?
        ORDER BY t.table_name,
            c.ordinal_position
      `;
      const rows = await this.executeQuery({
        sql,
        values: [
          this.$auth.database,
        ],
      });
      return rows.reduce((acc, row) => {
        acc[row.tableName] ??= {
          metadata: {
            rowCount: row.rowCount,
          },
          schema: {},
        };
        acc[row.tableName].schema[row.columnName] = {
          ...row,
        };
        return acc;
      }, {});
    },
    async _closeConnection(connection) {
      await connection.end();
      return new Promise((resolve) => {
        connection.connection.stream.on("close", resolve);
      });
    },
    async listStoredProcedures(args = {}) {
      const procedures = await this.executeQuery({
        sql: "SHOW PROCEDURE STATUS",
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
      return this.executeQuery({
        sql: "SHOW FULL TABLES",
        ...args,
      });
    },
    listBaseTables({
      lastResult,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
            AND CREATE_TIME > ?
            ORDER BY CREATE_TIME DESC
        `,
        values: [
          lastResult,
        ],
        ...args,
      });
    },
    listTopTables({
      maxCount = 10,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `
          SELECT * FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY CREATE_TIME DESC
            LIMIT ${maxCount}
        `,
        ...args,
      });
    },
    listColumns({
      table,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `SHOW COLUMNS FROM \`${table}\``,
        ...args,
      });
    },
    listNewColumns({
      table,
      previousColumns,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `
          SHOW COLUMNS FROM \`${table}\`
          WHERE Field NOT IN (?)
        `,
        values: [
          previousColumns?.join(),
        ],
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
      table,
      column,
      lastResult,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `
          SELECT * FROM \`${table}\`
          WHERE \`${column}\` > ?
          ORDER BY \`${column}\` DESC
        `,
        values: [
          lastResult,
        ],
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
      table,
      column,
      maxCount = 10,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `
          SELECT * FROM \`${table}\`
            ORDER BY \`${column}\` DESC
            LIMIT ${maxCount}
        `,
        ...args,
      });
    },
    getPrimaryKey({
      table,
      ...args
    } = {}) {
      return this.executeQuery({
        sql: "SHOW KEYS FROM ? WHERE Key_name = 'PRIMARY'",
        values: [
          table,
        ],
        ...args,
      });
    },
    async listColumnNames({
      table,
      ...args
    } = {}) {
      const columns = await this.listColumns({
        table,
        ...args,
      });
      return columns.map((column) => column.Field);
    },
    findRows({
      table,
      condition,
      values = [],
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `SELECT * FROM \`${table}\` WHERE ${condition}`,
        values,
        ...args,
      });
    },
    deleteRows({
      table,
      condition,
      values = [],
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `DELETE FROM \`${table}\` WHERE ${condition}`,
        values,
        ...args,
      });
    },
    insertRow({
      table,
      columns = [],
      values = [],
      ...args
    } = {}) {
      const placeholder = values.map(() => "?").join(",");
      return this.executeQuery({
        sql: `
          INSERT INTO \`${table}\` (${columns.join(",")})
            VALUES (${placeholder})
        `,
        values,
        ...args,
      });
    },
    updateRow({
      table,
      condition,
      conditionValues = [],
      columnsToUpdate = [],
      valuesToUpdate = [],
      ...args
    } = {}) {
      const updates =
        columnsToUpdate
          .map((column) => `\`${column}\` = ?`);

      return this.executeQuery({
        sql: `
          UPDATE \`${table}\`
            SET ${updates}
            WHERE ${condition}`,
        values: [
          ...valuesToUpdate,
          ...conditionValues,
        ],
        ...args,
      });
    },
    executeStoredProcedure({
      storedProcedure,
      values = [],
      ...args
    } = {}) {
      return this.executeQuery({
        sql: `CALL ${storedProcedure}(${values.map(() => "?")})`,
        values,
        ...args,
      });
    },
  },
};
