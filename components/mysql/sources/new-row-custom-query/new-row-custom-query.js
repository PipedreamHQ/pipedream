const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-row-custom-query",
  name: "New Row (Custom Query)",
  description: "Emits an event when new rows are returned from a custom query",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    table: { propDefinition: [common.props.mysql, "table"] },
    column: {
      propDefinition: [
        common.props.mysql,
        "column",
        (c) => ({ table: c.table }),
      ],
      label: "Order By",
      description:
        "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
    query: { propDefinition: [common.props.mysql, "query"] },
  },
  hooks: {
    async deploy() {
      const connection = await this.mysql.getConnection();
      let query = `SELECT * FROM ${this.table} ORDER BY ${this.column} DESC LIMIT 10`;
      query = this.createJoinQuery(query, this.column);
      const rows = await this.mysql.executeQuery(connection, query);
      this._setLastResult(rows, this.column);
      this.iterateAndEmitEvents(rows);
      await new Promise(resolve => { connection.connection.stream.on('close', resolve) });
    },
  },
  methods: {
    ...common.methods,
    /**
     * In this method, we create an INNER JOIN to combine the given query with a query to limit results to either
     * the 10 max results or only results updated since the lastResult.
     * @param {object} connection - The database connection.
     * @param {string} column - The table column used to ORDER BY
     */
    createJoinQuery(query, column) {
      return `
        SELECT * FROM (${query}) t1
        INNER JOIN
        (${this.query}) t2
        ON t1.${column} = t2.${column};
      `;
    },
    async listResults(connection) {
      let lastResult = this._getLastResult();
      let query = `SELECT * FROM ${this.table} WHERE ${this.column} > '${lastResult}' ORDER BY ${this.column} DESC`;
      query = this.createJoinQuery(query, this.column);
      const rows = await this.mysql.executeQuery(connection, query);
      this._setLastResult(rows, this.column);
      this.iterateAndEmitEvents(rows);
    },
    generateMeta(row) {
      return {
        id: JSON.stringify(row),
        summary: `New Row ${row[this.column]}`,
        ts: Date.now(),
      };
    },
  },
};