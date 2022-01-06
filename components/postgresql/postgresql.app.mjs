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
      description: "Your custom SQL query",
    },
    value: {
      type: "string",
      label: "Lookup Value",
      description: "Value to search for",
      async options({
        table, column,
      }) {
        return this.getColumnValues(table, column);
      },
    },
    rowValues: {
      type: "object",
      label: "Row Values",
      description: "Enter the column names and respective values as key/value pairs",
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
      client.end();
    },
    /**
     * Executes SQL query and returns the resulting rows
     * @param query {string} SQL query to execute
     * @returns Array of rows returned from the given SQL query
     */
    async executeQuery(query) {
      const client = await this.getClient();
      const { rows } = await client.query(query);
      await this.endClient(client);
      return rows;
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
     * @param table {string} Name of the table to get columns in
     * @returns Array of column names
     */
    async getColumns(table) {
      const rows = await this.executeQuery(`SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${table}'`);
      return rows.map((row) => row.column_name);
    },
    /**
     * Gets a table's primary key field
     * @param table {string} Name of the table to get the primary key for
     * @returns Name of the primary key column
     */
    async getPrimaryKey(table) {
      const rows = await this.executeQuery(`SELECT a.attname FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE i.indrelid = '${table}'::regclass AND i.indisprimary`);
      return rows[0].attname;
    },
    /**
     * Gets rows in a table with values greater than lastResult
     * @param table {string} Name of database table to query
     * @param column {string} Column to filter by lastResult
     * @param lastResult {string} A column value. Used to retrieve new rows since the
     *  last time the table was queried.
     * @returns Array of rows returned from the query
     */
    async getRows(table, column, lastResult = null) {
      const query = `SELECT * FROM ${table} ${lastResult
        ? "WHERE " + column + ">" + lastResult
        : ""} ORDER BY ${column} DESC`;
      const { rows } = await this.executeQuery(query);
      return rows;
    },
    /**
     * Gets a single row from a table based on a lookup column & value
     * @param table {string} Name of database table to query
     * @param column {string} Column to filter by value
     * @param value {string} A column value to search for
     * @returns A single database row
     */
    async findRowByValue(table, column, value) {
      const rows = await this.executeQuery(`SELECT * FROM ${table} WHERE ${column} = '${value}'`);
      return rows[0];
    },
    /**
     * Gets the number of rows in a table
     * @param table {string} Name of database table to query
     * @returns Count of how many rows exist in the table
     */
    async getRowCount(table) {
      const response = await this.executeQuery(`SELECT COUNT(*) FROM ${table}`);
      return response[0].count;
    },
    /**
     * Deletes a row or rows in a table based on a lookup column & value
     * @param table {string} Name of database table to delete from
     * @param column {string} Column used to find the row(s) to delete
     * @param value {string} A column value. Used to find the row(s) to delete
     */
    async deleteRows(table, column, value) {
      await this.executeQuery(`DELETE FROM ${table} WHERE ${column} = '${value}'`);
    },
    /**
     * Inserts a row in a table
     * @param table {string} Name of database table to insert row into
     * @param columns {array} Array of column names
     * @param values {array} Array of values corresponding to the column names provided
     * @returns The newly created row
     */
    async insertRow(table, columns, values) {
      const { rows } = this.executeQuery(`INSERT INTO ${table} (${columns.join()}) VALUES (${values.join()}) RETURNING *`);
      return rows;
    },
    /**
     * Updates a row in a table
     * @param table {string} Name of database table to update
     * @param lookupColumn {string} Column used to find row to update
     * @param lookupValue {string} A column value. Used to find row to update
     * @param rowValues {object} An object with keys representing column names
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
     * @param table {string} Name of database table to query
     * @param column {string} Name of column to get values from
     * @returns Array of column values
     */
    async getColumnValues(table, column) {
      const rows = await this.executeQuery(`SELECT ${column} FROM ${table}`);
      return rows.map((row) => row[column]);
    },
  },
};
