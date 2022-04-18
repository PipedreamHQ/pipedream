import pg from "pg";
import format from "pg-format";

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
      description: "Your custom SQL Query using `$1`, `$2`... to represent values (eg. `INSERT INTO users(name, email) VALUES($1, $2)`",
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "List of values represented in your SQL Query above",
    },
    value: {
      type: "string",
      label: "Lookup Value",
      description: "Value to search for",
      async options({
        table, column, prevContext,
      }) {
        const limit = 20;
        const { offset = 0 } = prevContext;
        return {
          options: await this.getColumnValues(table, column, limit, offset),
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
        .catch((err) => console.error("Connection error", err.stack));
      return client;
    },
    async endClient(client) {
      return client.end();
    },
    /**
     * Executes SQL query and returns the resulting rows
     * @param {string} text - SQL query to execute
     * @returns Array of rows returned from the given SQL query
     */
    async executeQuery(query) {
      const client = await this.getClient();
      try {
        const { rows } = await client.query(query);
        return rows;
      } finally {
        await this.endClient(client);
      }
    },
    /**
     * Gets an array of table names in a database
     * @returns Array of table names
     */
    async getTables() {
      const query = format("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      const rows = await this.executeQuery(query);
      return rows.map((row) => row.table_name);
    },
    /**
     * Gets an array of column names in a table
     * @param {string} table - Name of the table to get columns in
     * @returns Array of column names
     */
    async getColumns(table) {
      const rows = await this.executeQuery({
        text: format(`
          SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = $1
        `),
        values: [
          table,
        ],
      });
      return rows.map((row) => row.column_name);
    },
    /**
     * Gets a table's primary key field
     * @param {string} table - Name of the table to get the primary key for
     * @returns Name of the primary key column
     */
    async getPrimaryKey(table) {
      const rows = await this.executeQuery({
        text: format(`
          SELECT c.column_name, c.ordinal_position
          FROM information_schema.key_column_usage AS c
          LEFT JOIN information_schema.table_constraints AS t
          ON t.constraint_name = c.constraint_name
          WHERE t.table_name = '${table}' AND t.constraint_type = 'PRIMARY KEY';
        `),
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
    async getRows(table, column, lastResult = null) {
      const select = "SELECT * FROM %I";
      const where = "WHERE %I > $1";
      const orderby = "ORDER BY %I DESC";
      const query = lastResult
        ? {
          text: format(`${select} ${where} ${orderby}`, table, column, column),
          values: [
            lastResult,
          ],
        }
        : format(`${select} ${orderby}`, table, column);
      return this.executeQuery(query);
    },
    /**
     * Gets a single row from a table based on a lookup column & value
     * @param {string} table - Name of database table to query
     * @param {string} column - Column to filter by value
     * @param {string} value - A column value to search for
     * @returns A single database row
     */
    async findRowByValue(table, column, value) {
      const rows = await this.executeQuery({
        text: format("SELECT * FROM %I WHERE %I = $1", table, column),
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
    async deleteRows(table, column, value) {
      return this.executeQuery({
        text: format("DELETE FROM %I WHERE %I = $1 RETURNING *", table, column),
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
    async insertRow(table, columns, values) {
      const placeholders = this.getPlaceholders({
        values,
      });
      return this.executeQuery({
        text: format(`
          INSERT INTO %I (${columns}) 
            VALUES (${placeholders})
            RETURNING *
        `, table),
        values,
      });
    },
    getPlaceholders({
      values = [], fromIndex = 1,
    }) {
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
    async updateRow(table, lookupColumn, lookupValue, rowValues) {
      const columnsPlaceholders = this.getColumnsPlaceholders({
        rowValues,
        fromIndex: 2,
      });
      const response = await this.executeQuery({
        text: format(`
          UPDATE %I SET ${columnsPlaceholders}
            WHERE %I = (
              SELECT %I FROM %I
              WHERE %I = $1
              ORDER BY %I LIMIT 1
            ) RETURNING *
        `, table, lookupColumn, lookupColumn, table, lookupColumn, lookupColumn),
        values: [
          lookupValue,
          ...Object.values(rowValues),
        ],
      });
      return response[0];
    },
    getColumnsPlaceholders({
      rowValues = {}, fromIndex = 1,
    }) {
      return Object.keys(rowValues)
        .map((key, index) => `${key} = $${index + fromIndex}`);
    },
    /**
     * Gets all of the values for a single column in a table
     * @param {string} table - Name of database table to query
     * @param {string} column - Name of column to get values from
     * @params {string} [limit] - maximum number of rows to return
     * @params {integer} [offset] - number of rows to skip, used for pagination
     * @returns Array of column values
     */
    async getColumnValues(table, column, limit = "ALL", offset = 0) {
      const rows = await this.executeQuery({
        text: format(`
          SELECT %I FROM %I
            LIMIT $1::numeric OFFSET $2::numeric
        `, column, table),
        values: [
          limit,
          offset,
        ],
      });
      const values = rows.map((row) => row[column]?.toString());
      return values.filter((row) => row);
    },
  },
};
