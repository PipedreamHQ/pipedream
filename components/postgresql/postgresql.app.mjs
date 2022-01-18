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
     * @param {array} [values] - values to substitute into the given query
     * @returns Array of rows returned from the given SQL query
     */
    async executeQuery(text, values = null) {
      const client = await this.getClient();
      const query = values
        ? {
          text,
          values,
        }
        : text;
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
      const rows = await this.executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      return rows.map((row) => row.table_name);
    },
    /**
     * Gets an array of column names in a table
     * @param {string} table - Name of the table to get columns in
     * @returns Array of column names
     */
    async getColumns(table) {
      const rows = await this.executeQuery(`SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
      return rows.map((row) => row.column_name);
    },
    /**
     * Gets a table's primary key field
     * @param {string} table - Name of the table to get the primary key for
     * @returns Name of the primary key column
     */
    async getPrimaryKey(table) {
      const rows = await this.executeQuery(`SELECT a.attname FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = '${table}'::regclass AND i.indisprimary`);
      return rows[0].attname;
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
      const query = `SELECT * FROM ${table} ${lastResult
        ? "WHERE " + column + ">" + lastResult
        : ""} ORDER BY ${column} DESC`;
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
      const rows = await this.executeQuery(`SELECT * FROM ${table} WHERE ${column} = '${value}'`);
      return rows[0];
    },
    /**
     * Gets the number of rows in a table
     * @param {string} table - Name of database table to query
     * @returns Count of how many rows exist in the table
     */
    async getRowCount(table) {
      const response = await this.executeQuery(`SELECT COUNT(*) FROM ${table}`);
      return response[0].count;
    },
    /**
     * Deletes a row or rows in a table based on a lookup column & value
     * @param {string} table - Name of database table to delete from
     * @param {string} column - Column used to find the row(s) to delete
     * @param {string} value - A column value. Used to find the row(s) to delete
     */
    async deleteRows(table, column, value) {
      await this.executeQuery(`DELETE FROM ${table} WHERE ${column} = '${value}'`);
    },
    /**
     * Inserts a row in a table
     * @param {string} table - Name of database table to insert row into
     * @param {array} columns - Array of column names
     * @param {array} values - Array of values corresponding to the column names provided
     * @returns The newly created row
     */
    async insertRow(table, columns, values) {
      return this.executeQuery(`INSERT INTO ${table} (${columns}) VALUES (${values.map((v) => "'" + v + "'")}) RETURNING *`);
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
      const primaryKey = await this.getPrimaryKey(table);
      let query = `UPDATE ${table} SET`;
      Object.entries(rowValues).forEach(([
        key,
        val,
      ]) => {
        query += ` ${key} = '${val}',`;
      });
      // trim last comma
      query = query.slice(0, -1);
      query += ` WHERE ${primaryKey} =(SELECT ${primaryKey} FROM ${table} WHERE ${lookupColumn} = '${lookupValue}' ORDER BY ${primaryKey} LIMIT 1) RETURNING *`;
      const response = await this.executeQuery(query);
      return response[0];
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
      const rows = await this.executeQuery(`SELECT ${column} FROM ${table} LIMIT ${limit} OFFSET ${offset}`);
      return rows.map((row) => row[column]);
    },
  },
};
