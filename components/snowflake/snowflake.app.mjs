import snowflake from "snowflake-sdk";
import { promisify } from "util";

export default {
  app: "snowflake",
  type: "app",
  propDefinitions: {
    database: {
      type: "string",
      label: "Database",
      description: "The database to use",
      async options() {
        const options = await this.listDatabases();
        return options.map((i) => i.name);
      },
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to use",
      async options({ database }) {
        const options = await this.listSchemas(database);
        return options.map((i) => i.name);
      },
    },
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
      description: "Select the columns you want to insert data into",
      async options({ tableName }) {
        const fields = await this.listFieldsForTable(tableName);
        return fields.map((field) => field.name);
      },
    },
    values: {
      type: "string",
      label: "Row Values",
      description:
        "**Provide an array of arrays**. Each nested array should represent a row, with each element of the nested array representing a value (e.g., passing `[[\"Foo\",1,2],[\"Bar\",3,4]]` will insert two rows of data with three columns each). The most common pattern is to reference an array of arrays [exported by a previous step](https://pipedream.com/docs/workflows/steps/#step-exports) (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of arrays.",
    },
    emitIndividualEvents: {
      type: "boolean",
      label: "Emit individual events",
      description: "Defaults to `true`, triggering workflows on each record in the result set. Set to `false` to emit records in batch (advanced)",
      optional: true,
      default: true,
    },
    warehouses: {
      type: "string[]",
      label: "Warehouse Name",
      description: "**Optional**. The name of the warehouse(s) you want to watch for changes. If not provided, changes will be emitted for all warehouses this account has access to.",
      async options() {
        const options = await this.listWarehouses();
        return options.map((i) => i.name);
      },
    },
    users: {
      type: "string[]",
      label: "User Name",
      description: "**Optional**. The name of the user(s) you want to watch for changes. If not provided, changes will be emitted for all users this account has access to.",
      async options() {
        const options = await this.listUsers();
        return options.map((i) => i.login_name);
      },
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
    async listDatabases() {
      const sqlText = "SHOW DATABASES";
      return this.collectRows({
        sqlText,
      });
    },
    async listSchemas(database) {
      const sqlText = "SHOW SCHEMAS IN DATABASE IDENTIFIER(:1)";
      return this.collectRows({
        sqlText,
        binds: [
          database,
        ],
      });
    },
    async listWarehouses() {
      const sqlText = "SHOW WAREHOUSES";
      return this.collectRows({
        sqlText,
      });
    },
    async listUsers() {
      const sqlText = "SHOW USERS";
      return this.collectRows({
        sqlText,
      });
    },
    async maxQueryHistoryTimestamp() {
      const sqlText = "SELECT MAX(START_TIME) AS max_ts FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY";
      const maxTs = await this.collectRows({
        sqlText,
      });
      return +new Date(maxTs[0]?.MAX_TS);
    },
    async maxTaskHistoryTimestamp() {
      const sqlText = "SELECT MAX(QUERY_START_TIME) AS max_ts FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())";
      const maxTs = await this.collectRows({
        sqlText,
      });
      return +new Date(maxTs[0]?.MAX_TS);
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
    // Query Snowflake query history.
    // start and endTime bound the query. Both expect epoch ms timestamps.
    // filters is a SQL statement that will be ANDed with the query.
    async queryHistory(startTime, endTime, filters) {
      const sqlText = `SELECT *
      FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
      WHERE START_TIME >= to_timestamp_ltz(${startTime}, 3)
      AND START_TIME < to_timestamp_ltz(${endTime}, 3)
      AND ${filters}
      ORDER BY START_TIME ASC;`;
      const statement = {
        sqlText,
      };
      console.log(`Running query: ${sqlText}`);
      return this.collectRows(statement);
    },
    async getFailedTasksInDatabase({
      startTime, database, schemas, taskName,
    }) {
      const binds = [
        startTime,
        database,
      ];

      let schemaList = [];
      for (const schema of schemas) {
        schemaList.push("REGEXP_LIKE(SCHEMA_NAME, ?)");
        binds.push(schema);
      }

      const taskNameWhere = taskName
        ? "AND REGEXP_LIKE(NAME, ?)"
        : "";

      if (taskName) {
        binds.push(taskName.toUpperCase());
      }

      const sqlText = `SELECT *
      FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY(
        RESULT_LIMIT => 10000,
        ERROR_ONLY => TRUE,
        SCHEDULED_TIME_RANGE_START => to_timestamp_ltz(?, 3)
      ))
      WHERE database_name = ?
      AND (${schemaList.join(" OR ")})
      ${taskNameWhere}
      ORDER BY SCHEDULED_TIME ASC, QUERY_START_TIME ASC, COMPLETED_TIME ASC;`;
      const statement = {
        sqlText,
        binds,
      };
      return this.collectRows(statement);
    },
    async getFailedTasksInWarehouse({
      startTime, endTime, warehouse,
    }) {
      const sqlText = `SELECT *
      FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())
      WHERE QUERY_START_TIME >= to_timestamp_ltz(:1, 3)
      AND QUERY_START_TIME < to_timestamp_ltz(:2, 3)
      AND state = 'FAILED'
      AND warehouse = :3
      ORDER BY QUERY_START_TIME ASC;`;
      const statement = {
        sqlText,
        binds: [
          startTime,
          endTime,
          warehouse,
        ],
      };
      return this.collectRows(statement);
    },
    async getChangesForSpecificObject(startTime, endTime, objectType) {
      const filters = `QUERY_TYPE != 'SELECT' AND (QUERY_TEXT ILIKE '%CREATE ${objectType}%' OR QUERY_TEXT ILIKE '%ALTER ${objectType}%' OR QUERY_TEXT ILIKE '%DROP ${objectType}%')`;
      return this.queryHistory(startTime, endTime, filters);
    },
    async insertRow(tableName, values) {
      const columns = Object.keys(values);
      const binds = Object.values(values);
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(", ")});`;
      const statement = {
        sqlText,
        binds,
      };
      return this.collectRows(statement);
    },
    async insertRows(tableName, columns, binds) {
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(", ")});`;
      const statement = {
        sqlText,
        binds,
      };
      return this.collectRows(statement);
    },
  },
};
