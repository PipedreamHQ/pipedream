import pg from "pg";
import format from "pg-format";
import {
  sqlProp,
  sqlProxy,
  ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "postgresql",
  propDefinitions: {
    schema: {
      type: "string",
      label: "Schema",
      description: "Database schema",
      async options() {
        return this.getSchemas();
      },
    },
    table: {
      type: "string",
      label: "Table",
      description: "Database table",
      async options({ schema }) {
        return this.getTables(this._getNormalizedSchema(schema));
      },
    },
    column: {
      type: "string",
      label: "Column",
      description: "The name of a column in the table to use for deduplication. Defaults to the table's primary key",
      async options({
        table, schema,
      }) {
        return this.getColumns(table, this._getNormalizedSchema(schema));
      },
    },
    query: {
      type: "string",
      label: "SQL Query",
      description: "Your custom SQL Query using `$1`, `$2`... to represent values (eg. `INSERT INTO users(name, email) VALUES($1, $2)`",
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "List of values represented in your SQL Query above",
      optional: true,
    },
    value: {
      type: "string",
      label: "Lookup Value",
      description: "Value to search for",
      async options({
        table, column, prevContext, schema,
      }) {
        const limit = 20;
        const normalizedSchema = this._getNormalizedSchema(schema);
        const { offset = 0 } = prevContext;
        return {
          options: await this
            .getColumnValues(table, column, limit, offset, normalizedSchema),
          context: {
            offset: limit + offset,
          },
        };
      },
    },
    rowValues: {
      type: "object",
      label: "Row Values",
      description: "Enter the column names and respective values as key/value pairs, or with structured mode off as `{{{columnName:\"columnValue\"}}}`",
    },
  },
  methods: {
    ...sqlProp.methods,
    ...sqlProxy.methods,
    _getSslConfig() {
      const {
        ca,
        key,
        cert,
        ssl_verification_mode: mode,
      } = this.$auth;

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
        rejectUnauthorized: mode !== "skip_verification",
      };

      return Object.keys(ssl).length > 0
        ? ssl
        : undefined;
    },

    /**
     * A helper method to get the configuration object that's directly fed to
     * the PostgreSQL client constructor. Used by other features (like SQL
     * proxy) to initialize their client in an identical way.
     * @returns {object} - Configuration object for the PostgreSQL client
     */
    getClientConfiguration() {
      const {
        host,
        port,
        user,
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
    async _getClient() {
      const config = this.getClientConfiguration();
      const client = new pg.Client(config);
      try {
        await client.connect();
      } catch (err) {
        if (err.code === "SELF_SIGNED_CERT_IN_CHAIN") {
          throw new ConfigurationError(`SSL verification failed: \`${err}\`. To resolve this, reconnect your account and set SSL Verification Mode: Skip Verification, and try again.`);
        }
        console.error("Connection error", err.stack);
        throw err;
      }
      return client;
    },
    async _endClient(client) {
      return client.end();
    },
    /**
     * Adapts the arguments to `executeQuery` so that they can be consumed by
     * the SQL proxy (when applicable). Note that this method is not intended to
     * be used by the component directly.
     * @param {object|string} query The query string or object to be sent to the DB.
     * @param {string} query.text The prepared SQL query to be executed.
     * @param {string[]} query.values The values to replace in the SQL query.
     * @returns {object} - The adapted query and parameters.
     */
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
        query: text = "",
        params: values = [],
      } = proxyArgs;
      return {
        text,
        values,
      };
    },
    /**
     * Executes a query against the PostgreSQL database. This method takes care
     * of connecting to the database, executing the query, and closing the
     * connection.
     * @param {object|string} query The query string or object to be sent to the DB.
     * @param {string} query.text The prepared SQL query to be executed.
     * @param {string[]} query.values The values to replace in the SQL query.
     * SQL query.
     * @returns {object[]} - The rows returned by the DB as a result of the
     * query.
     */
    async executeQuery(query) {
      const client = await this._getClient();

      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this._endClient(client);
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
      const text = `
        SELECT table_name AS "tableName",
          column_name AS "columnName",
          is_nullable AS "isNullable",
          data_type AS "dataType",
          column_default AS "columnDefault"
        FROM information_schema.columns
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
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
    /**
     * Gets an array of table names in a database
     * @returns Array of table names
     */
    async getTables(schema = "public") {
      const query = format("SELECT table_name FROM information_schema.tables WHERE table_schema = %L", schema);
      const rows = await this.executeQuery(query);
      return rows.map((row) => row.table_name);
    },
    /**
     * Gets an array of schemas in a database
     * @returns Array of schemas
     */
    async getSchemas() {
      const query = format("select schema_name FROM information_schema.schemata");
      const rows = await this.executeQuery(query);
      return rows.map((row) => row.schema_name);
    },
    /**
     * Gets an array of column names in a table
     * @param {string} table - Name of the table to get columns in
     * @returns Array of column names
     */
    async getColumns(table, schema = "public") {
      if (!table) {
        return [];
      }

      const query = format(`
        SELECT column_name
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = %L AND TABLE_NAME = %L
      `, schema, table);
      const rows = await this.executeQuery(query);
      return rows.map((row) => row.column_name);
    },
    /**
     * Gets a table's primary key field
     * @param {string} table - Name of the table to get the primary key for
     * @returns Name of the primary key column
     */
    async getPrimaryKey(table, schema = "public") {
      const rows = await this.executeQuery({
        text: format(`
          SELECT c.column_name, c.ordinal_position
          FROM information_schema.key_column_usage AS c
          LEFT JOIN information_schema.table_constraints AS t
          ON t.constraint_name = c.constraint_name
          WHERE t.table_name = %L and t.table_schema = %L AND t.constraint_type = 'PRIMARY KEY';
        `, table, schema),
      });
      return rows[0]?.column_name;
    },
    /**
     * Gets rows in a table with values greater than lastResult
     * @param {string} table - Name of database table to query
     * @param {string} column - Column to filter by lastResult
     * @param {string} [lastResult] - A column value. Used to retrieve new rows since the
     *  last time the table was queried.
     * @returns Array of rows returned from the query
     */
    async getRows(table, column, lastResult = null, schema = "public") {
      const select = "SELECT * FROM %I.%I";
      const where = "WHERE %I > $1";
      const orderby = "ORDER BY %I DESC";
      const query = lastResult
        ? {
          text: format(`${select} ${where} ${orderby}`, schema, table, column, column),
          values: [
            lastResult,
          ],
        }
        : format(`${select} ${orderby}`, schema, table, column);
      return this.executeQuery(query);
    },
    /**
     * Gets a single row from a table based on a lookup column & value
     * @param {string} table - Name of database table to query
     * @param {string} column - Column to filter by value
     * @param {string} value - A column value to search for
     * @returns A single database row
     */
    async findRowByValue(schema, table, column, value) {
      const rows = await this.executeQuery({
        text: format("SELECT * FROM %I.%I WHERE %I = $1", schema, table, column),
        values: [
          value,
        ],
      });
      return rows[0];
    },
    /**
     * Deletes a row or rows in a table based on a lookup column & value
     * @param {string} table - Name of database table to delete from
     * @param {string} column - Column used to find the row(s) to delete
     * @param {string} value - A column value. Used to find the row(s) to delete
     */
    async deleteRows(schema, table, column, value) {
      return this.executeQuery({
        text: format("DELETE FROM %I.%I WHERE %I = $1 RETURNING *", schema, table, column),
        values: [
          value,
        ],
      });
    },
    /**
     * Inserts a row in a table
     * @param {string} table - Name of database table to insert row into
     * @param {array} columns - Array of column names
     * @param {array} values - Array of values corresponding to the column names provided
     * @returns The newly created row
     */
    async insertRow(schema, table, columns, values) {
      const placeholders = this.getPlaceholders({
        values,
      });
      return this.executeQuery({
        text: format(`
          INSERT INTO %I.%I (${columns})
            VALUES (${placeholders})
            RETURNING *
        `, schema, table),
        values,
      });
    },
    getPlaceholders({
      values = [],
      fromIndex = 1,
    } = {}) {
      return values.map((_, index) => `$${index + fromIndex}`);
    },
    /**
     * Updates a row in a table
     * @param {string} table - Name of database table to update
     * @param {string} lookupColumn - Column used to find row to update
     * @param {string} lookupValue - A column value. Used to find row to update
     * @param {object} rowValues - An object with keys representing column names
     *  and values representing new column values
     * @returns The newly updated row
     */
    async updateRow(schema, table, lookupColumn, lookupValue, rowValues) {
      const columnsPlaceholders = this._getColumnsPlaceholders({
        rowValues,
        fromIndex: 2,
      });
      const response = await this.executeQuery({
        text: format(`
          UPDATE %I.%I SET ${columnsPlaceholders}
            WHERE %I = (
              SELECT %I FROM %I.%I
              WHERE %I = $1
              ORDER BY %I LIMIT 1
            ) RETURNING *
        `, schema, table, lookupColumn, lookupColumn, schema, table, lookupColumn, lookupColumn),
        values: [
          lookupValue,
          ...Object.values(rowValues),
        ],
      });
      return response[0];
    },
    _getColumnsPlaceholders({
      rowValues = {},
      fromIndex = 1,
    } = {}) {
      return Object
        .keys(rowValues)
        .map((key, index) => `${key} = $${index + fromIndex}`);
    },
    /**
     * Gets all of the values for a single column in a table
     * @param {string} table - Name of database table to query
     * @param {string} column - Name of column to get values from
     * @param {string} [limit] - maximum number of rows to return
     * @param {integer} [offset] - number of rows to skip, used for pagination
     * @returns Array of column values
     */
    async getColumnValues(table, column, limit = "ALL", offset = 0, schema = "public") {
      const rows = await this.executeQuery({
        text: format(`
          SELECT %I
          FROM %I.%I
          LIMIT $1::numeric OFFSET $2::numeric
        `, column, schema, table),
        values: [
          limit,
          offset,
        ],
      });
      const values = rows.map((row) => row[column]?.toString());
      return values.filter((row) => row);
    },
    async getInitialRows(schema, table, column, limitNum = 10) {
      const select = "SELECT * FROM %I.%I";
      const orderby = "ORDER BY %I DESC";
      const limit = "LIMIT $1";
      const query = {
        text: format(`${select} ${orderby} ${limit}`, schema, table, column),
        values: [
          limitNum,
        ],
      };
      return this.executeQuery(query);
    },
    /**Normalize Schema**/
    _getNormalizedSchema(schema) {
      return schema ?? "public";
    },
  },
};
