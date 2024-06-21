import { createPrivateKey } from "crypto";
import { snowflake } from "@pipedream/snowflake-sdk";
import { promisify } from "util";
import {
  sqlProxy, sqlProp,
} from "@pipedream/platform";

snowflake.configure({
  logLevel: "WARN",
});

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
      async options({
        database, schema,
      }) {
        const options = await this.listTables({
          database,
          schema,
        });
        return options.map((i) => ({
          value: `${database}.${schema}.${i.name}`,
          label: i.name,
        }));
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
    ...sqlProxy.methods,
    ...sqlProp.methods,
    async _getConnection() {
      if (this.connection) {
        return this.connection;
      }

      const options = this.getClientConfiguration();
      this.connection = snowflake.createConnection(options);
      await promisify(this.connection.connect).bind(this.connection)();
      return this.connection;
    },
    _extractPrivateKey(key, passphrase) {
      if (!key?.startsWith("-----BEGIN ENCRYPTED PRIVATE KEY-----")) {
        // Key undefined or is not encrypted, no need to extract anything
        return key;
      }

      const privateKeyObject = createPrivateKey({
        key,
        format: "pem",
        passphrase,
      });
      return privateKeyObject.export({
        format: "pem",
        type: "pkcs8",
      });
    },
    /**
     * A helper method to get the configuration object that's directly fed to
     * the Snowflake client constructor. Used by other features (like SQL proxy)
     * to initialize their client in an identical way.
     *
     * @returns The configuration object for the Snowflake client
     */
    getClientConfiguration() {
      // Snowflake docs:
      // https://docs.snowflake.com/en/developer-guide/node-js/nodejs-driver-options#authentication-options
      const {
        private_key: originalPrivateKey,
        private_key_pass: privateKeyPass,
        ...auth
      } = this.$auth;
      const privateKey = this._extractPrivateKey(originalPrivateKey, privateKeyPass);
      const authenticator = privateKey
        ? "SNOWFLAKE_JWT"
        : "SNOWFLAKE";
      return {
        ...auth,
        application: "PIPEDREAM_PIPEDREAM",
        authenticator,
        privateKey,
        privateKeyPass,
      };
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
      const sqlText = `
        SELECT LOWER(t.table_schema) AS "tableSchema",
            LOWER(t.table_name) AS "tableName",
            TO_NUMERIC(t.row_count) AS "rowCount",
            LOWER(c.column_name) AS "columnName",
            LOWER(c.data_type) AS "dataType",
            LOWER(c.is_nullable) AS "isNullable",
            LOWER(c.column_default) AS "columnDefault"
        FROM information_schema.tables AS t
            JOIN information_schema.columns AS c ON t.table_name = c.table_name
            AND t.table_schema = c.table_schema
        WHERE t.table_schema = ?
        ORDER BY t.table_name,
            c.ordinal_position;
      `;
      const binds = [
        this.$auth.schema,
      ];
      const rows = await this.executeQuery({
        sqlText,
        binds,
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
    proxyAdapter(preparedStatement = {}) {
      const {
        sqlText: query = "",
        binds: params = [],
      } = preparedStatement;
      return {
        query,
        params,
      };
    },
    executeQueryAdapter(proxyArgs = {}) {
      const {
        query: sqlText = "",
        params: binds = [],
      } = proxyArgs;
      return {
        sqlText,
        binds,
      };
    },
    async executeQuery(statement) {
      const connection = await this._getConnection();
      const executedStatement = connection.execute(statement);

      const rowStream = await executedStatement.streamRows();
      const rows = [];
      for await (const row of rowStream) {
        rows.push(row);
      }
      return rows;
    },
    async listTables({
      database, schema,
    }) {
      let sqlText = `SHOW TABLES IN SCHEMA ${database}.${schema}`;
      return this.executeQuery({
        sqlText,
      });
    },
    async listDatabases() {
      const sqlText = "SHOW DATABASES";
      return this.executeQuery({
        sqlText,
      });
    },
    async listSchemas(database) {
      const sqlText = "SHOW SCHEMAS IN DATABASE IDENTIFIER(:1)";
      return this.executeQuery({
        sqlText,
        binds: [
          database,
        ],
      });
    },
    async listWarehouses() {
      const sqlText = "SHOW WAREHOUSES";
      return this.executeQuery({
        sqlText,
      });
    },
    async listUsers() {
      const sqlText = "SHOW USERS";
      return this.executeQuery({
        sqlText,
      });
    },
    async maxQueryHistoryTimestamp() {
      const sqlText = "SELECT MAX(START_TIME) AS max_ts FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY";
      const maxTs = await this.executeQuery({
        sqlText,
      });
      return +new Date(maxTs[0]?.MAX_TS);
    },
    async maxTaskHistoryTimestamp() {
      const sqlText = "SELECT MAX(QUERY_START_TIME) AS max_ts FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())";
      const maxTs = await this.executeQuery({
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
      return this.executeQuery(statement);
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
      return this.executeQuery(statement);
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
      return this.executeQuery(statement);
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
      return this.executeQuery(statement);
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
      return this.executeQuery(statement);
    },
    async insertRows(tableName, columns, binds) {
      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${columns.map(() => "?").join(", ")});`;
      const statement = {
        sqlText,
        binds,
      };
      return this.executeQuery(statement);
    },
  },
};
