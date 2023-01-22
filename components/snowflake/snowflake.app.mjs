import snowflake from "snowflake-sdk";
import { promisify } from "util";

export default {
  app: "snowflake",
  type: "app",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the Snowflake table you want to run the query on",
      async options() {
        const options = await this.listTables();
        return options.map((i) => i.name);
      },
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Select the columns to insert data",
      async options({ tableName }) {
        const fields = await this.listFieldsForTable(tableName);
        return fields.map((field) => field.name);
      },
    },
    emitIndividualEvents: {
      type: "boolean",
      label: "Emit individual events",
      description: "Defaults to `true`, triggering workflows on each record in the result set. Set to `false` to emit records in batch (advanced)",
      optional: true,
      default: true,
    },
  },
  methods: {
    async _getConnection() {
      if (this.connection) {
        return this.connection;
      }

      this.connection = snowflake.createConnection({
        ...this.$auth,
        application: "PIPEDREAM_PIPEDEAM",
      });
      await promisify(this.connection.connect).bind(this.connection)();
      return this.connection;
    },
    async getRows(statement) {
      const connection = await this._getConnection();
      const executedStatement = connection.execute(statement);
      return executedStatement.streamRows();
    },
    async collectRows(statement) {
      const rowStream = await this.getRows(statement);
      const rows = [];
      for await (const row of rowStream) {
        rows.push(row);
      }
      return rows;
    },
    async listTables() {
      const sqlText = "SHOW TABLES";
      return this.collectRows({
        sqlText,
      });
    },
    async listFieldsForTable(tableName) {
      const sqlText = "DESCRIBE TABLE IDENTIFIER(:1)";
      const binds = [
        tableName,
      ];
      const statement = {
        sqlText,
        binds,
      };
      return this.collectRows(statement);
    },
    async insertRows(tableName, columns, rows) {
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(", ")});`;
      const statement = {
        sqlText,
        binds: rows,
      };
      return this.collectRows(statement);
    },
  },
};
