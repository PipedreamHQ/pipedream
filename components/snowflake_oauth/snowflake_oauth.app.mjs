import snowflake from "snowflake-sdk";
import { promisify } from "util";
import {
  sqlProxy, sqlProp, ConfigurationError,
} from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

snowflake.configure({
  logLevel: "WARN",
});

export default {
  app: "snowflake_oauth",
  type: "app",
  propDefinitions: {
    database: {
      type: "string",
      label: "Database",
      description: "The database to use. Run the **List Databases** action first to find available database names, then paste a name here.",
      optional: true,
    },
    schema: {
      type: "string",
      label: "Schema",
      description: "The schema to use. Run the **List Schemas** action (with your chosen database) first to find available schema names, then paste a name here.",
      optional: true,
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The fully-qualified table name in `database.schema.table` form. Run the **List Tables** action (with your chosen database and schema) first, then paste the value here.",
      optional: true,
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "The columns you want to insert data into. Run the **List Columns** action (with your fully-qualified table name) first, then enter them here.",
      optional: true,
    },
    values: {
      type: "string",
      label: "Row Values",
      description: "**Provide an array of arrays**. Each nested array represents a row, with each element a value (e.g. `[[\"Foo\",1,2],[\"Bar\",3,4]]` inserts two rows of three columns each). Commonly references a previous step export (e.g. `{{steps.foo.$return_value}}`). May also be a string that JSON.parse()s to an array of arrays.",
    },
    emitIndividualEvents: {
      type: "boolean",
      label: "Emit individual events",
      description: "Defaults to `true`, triggering workflows on each record in the result set. Set to `false` to emit records in batch (advanced).",
      optional: true,
      default: true,
    },
    warehouses: {
      type: "string[]",
      label: "Warehouse Name",
      description: "**Optional**. The warehouse name(s) to watch. Run the **List Warehouses** action first. If not provided, all accessible warehouses are used.",
      optional: true,
    },
    users: {
      type: "string[]",
      label: "User Name",
      description: "**Optional**. The user name(s) to watch. Run the **List Users** action first. If not provided, all accessible users are used.",
      optional: true,
    },
  },
  methods: {
    ...sqlProxy.methods,
    ...sqlProp.methods,
    /**
     * A helper method to get the configuration object that's directly fed to
     * the Snowflake client constructor. Used by other features (like SQL proxy)
     * to initialize their client in an identical way.
     *
     * @returns The configuration object for the Snowflake client
     */
    getClientConfiguration() {
      const {
        snowflake_account_url: accountUrl,
        oauth_access_token: token,
      } = this.$auth;
      // The OAuth app collects a full account URL (e.g. https://<account>.snowflakecomputing.com),
      // not a bare account identifier. Derive the account locator the SDK expects from it.
      const account = new URL(accountUrl).hostname.replace(".snowflakecomputing.com", "");
      return {
        account,
        authenticator: "OAUTH",
        token,
        application: "PIPEDREAM_PIPEDREAM",
      };
    },
    async _getConnection() {
      if (this.connection) {
        return this.connection;
      }

      const options = this.getClientConfiguration();
      this.connection = snowflake.createConnection(options);
      await promisify(this.connection.connect).bind(this.connection)();
      return this.connection;
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
      const sqlText = `SHOW TABLES IN SCHEMA ${database}.${schema}`;
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

      const schemaList = [];
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
    async _insertRowsOriginal(tableName, columns, values) {
      // Create placeholders for all rows
      const rowPlaceholders = values.map(() =>
        `(${columns.map(() => "?").join(", ")})`).join(", ");

      const sqlText = `INSERT INTO ${tableName} (${columns.join(",")}) VALUES ${rowPlaceholders}`;

      // Flatten all values into a single array for binding
      const binds = values.flat();

      const statement = {
        sqlText,
        binds,
      };

      return this.executeQuery(statement);
    },
    async insertRows(tableName, columns, values, options = {}) {
      const {
        batchSize = constants.DEFAULT_BATCH_SIZE,
        maxPayloadSizeMB = constants.MAX_PAYLOAD_SIZE_MB,
        enableBatching = true,
      } = options;

      // If batching is disabled or small dataset, use original approach
      if (!enableBatching || values.length <= constants.INSERT_BATCH_THRESHOLD) {
        return this._insertRowsOriginal(tableName, columns, values);
      }

      // Estimate payload size for dynamic batch sizing
      const sampleRowData = values.slice(0, Math.min(constants.SAMPLE_ROW_COUNT, values.length));
      const sampleSize = utils.estimatePayloadSize(sampleRowData);
      const avgRowSize = sampleSize / sampleRowData.length;
      const maxSizeBytes = maxPayloadSizeMB * 1024 * 1024;

      // Calculate optimal batch size with safety margin
      const calculatedBatchSize = Math.floor(
        (maxSizeBytes * constants.BATCH_SAFETY_MARGIN) / avgRowSize,
      );
      const optimalBatchSize = Math.min(
        Math.max(calculatedBatchSize, constants.MIN_ROWS_PER_BATCH),
        Math.min(batchSize, constants.MAX_ROWS_PER_BATCH),
      );

      console.log(`Processing ${values.length} rows in batches of ${optimalBatchSize}`);

      // Split into batches
      const batches = utils.createBatches(values, optimalBatchSize);

      // Process batches sequentially
      const results = [];
      let totalRowsProcessed = 0;
      let successfulBatches = 0;
      let failedBatches = 0;

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];

        try {
          console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} rows)`);

          const batchResult = await this._insertRowsOriginal(tableName, columns, batch);

          results.push({
            batchIndex: i + 1,
            rowsProcessed: batch.length,
            success: true,
            result: batchResult,
          });

          totalRowsProcessed += batch.length;
          successfulBatches++;

          // Small delay between batches to prevent overwhelming the server
          if (i < batches.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, constants.BATCH_DELAY_MS));
          }

        } catch (error) {
          console.log(`Batch ${i + 1} failed:`, error.message);

          results.push({
            batchIndex: i + 1,
            rowsProcessed: 0,
            success: false,
            error: error.message,
          });

          failedBatches++;

          // Continue processing remaining batches
        }
      }

      const summary = {
        totalRows: values.length,
        totalBatches: batches.length,
        successfulBatches,
        failedBatches,
        totalRowsProcessed,
        batchSize: optimalBatchSize,
        results,
      };

      console.log(`Batch processing completed: ${totalRowsProcessed}/${values.length} rows processed`);

      if (failedBatches) {
        const error = new ConfigurationError(
          `Batch insert partially failed: \`${totalRowsProcessed}/${values.length}\` rows inserted. \`${failedBatches}\` batches failed.`,
        );
        error.summary = summary;
        throw error;
      }

      return {
        success: true,
        message: `Successfully inserted ${totalRowsProcessed} rows in ${batches.length} batches`,
        summary,
      };
    },
  },
};
