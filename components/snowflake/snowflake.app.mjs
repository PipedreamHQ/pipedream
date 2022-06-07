import snowflake from "snowflake-sdk";
import { promisify } from "util";

export default {
  app: "snowflake",
  type: "app",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
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
    values: {
      type: "string[]",
      label: "Values",
      description: "Insert values for the selected columns respectively. For string values, wrap them in **single quotes**. Example: `'This is a string'`",
    },
  },
  methods: {
    async _getConnection() {
      if (this.connection) {
        return this.connection;
      }

      this.connection = snowflake.createConnection(this.$auth);
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
    async *collectRowsPaginated(statement, pageSize = 1) {
      const rowStream = await this.getRows(statement);
      let rows = [];
      for await (const row of rowStream) {
        rows.push(row);
        if (rows.length === pageSize) {
          yield rows;
          rows = [];
        }
      }
      yield rows;
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
    async insertRow(tableName, columns, values) {
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${values.join(",")});`;
      const binds = [
        tableName,
      ];
      const statement = {
        sqlText,
        binds,
      };
      return this.collectRows(statement);
    },
  },
};
