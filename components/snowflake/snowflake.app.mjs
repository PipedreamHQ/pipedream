import snowflake from "snowflake-sdk";
import { promisify } from "util";

export default {
  app: "snowflake",
  type: "app",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      async options(context) {
        const { page } = context;
        if (page !== 0) return [];
        const options = await this.listTables();
        return options.map((i) => i.name);
      },
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
  },
};
