import crypto from "crypto";
import { isString } from "lodash-es";
import googleCloud from "../../google_cloud.app.mjs";
import common from "../common/bigquery.mjs";

export default {
  ...common,
  key: "google_cloud-bigquery-new-row",
  // eslint-disable-next-line pipedream/source-name
  name: "BigQuery - New Row",
  description: "Emit new events when a new row is added to a table",
  version: "0.1.9",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    tableId: {
      propDefinition: [
        googleCloud,
        "tableId",
        ({ datasetId }) => ({
          datasetId,
        }),
      ],
    },
    uniqueKey: {
      type: "string",
      label: "Unique Key",
      description: "The name of a column in the table to use for deduplication. See [the docs](https://github.com/PipedreamHQ/pipedream/tree/master/components/google_cloud/sources/bigquery-new-row#technical-details) for more info.",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const columnNames = await this._getColumnNames();
        return columnNames.sort();
      },
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      await this._validateColumn(this.uniqueKey);
      const lastResultId = await this._getIdOfLastRow(this.getInitialEventCount());
      this._setLastResultId(lastResultId);
    },
    async activate() {
      if (this._getLastResultId()) {
        // ID of the last result has already been initialised during deploy(),
        // so we skip the rest of the activation.
        return;
      }

      await this._validateColumn(this.uniqueKey);
      const lastResultId = await this._getIdOfLastRow();
      this._setLastResultId(lastResultId);
    },
  },
  methods: {
    ...common.methods,
    _getLastResultId() {
      return this.db.get("lastResultId");
    },
    _setLastResultId(lastResultId) {
      this.db.set("lastResultId", lastResultId);
      console.log(`
        Next scan of table '${this.tableId}' will start at ${this.uniqueKey}=${lastResultId}
      `);
    },
    /**
     * Utility method to make sure that a certain column exists in the target
     * table. Useful for SQL query sanitizing.
     *
     * @param {string} columnNameToValidate The name of the column to validate
     * for existence
     */
    async _validateColumn(columnNameToValidate) {
      if (!isString(columnNameToValidate)) {
        throw new Error("columnNameToValidate must be a string");
      }

      const columnNames = await this._getColumnNames();
      if (!columnNames.includes(columnNameToValidate)) {
        throw new Error(`Nonexistent column: ${columnNameToValidate}`);
      }
    },
    async _getColumnNames() {
      const table = this.googleCloud
        .getBigQueryClient()
        .dataset(this.datasetId)
        .table(this.tableId);
      const [
        metadata,
      ] = await table.getMetadata();
      const { fields } = metadata.schema;
      return fields.map(({ name }) => name);
    },
    async _getIdOfLastRow(offset = 0) {
      const limit = offset + 1;
      const query = `
        SELECT *
        FROM \`${this.tableId}\`
        ORDER BY \`${this.uniqueKey}\` DESC
        LIMIT @limit
      `;
      const queryOpts = {
        query,
        params: {
          limit,
        },
      };
      const client = this.googleCloud
        .getBigQueryClient()
        .dataset(this.datasetId);

      let job;
      try {
        const [
          createdJob,
        ] = await client.createQueryJob(queryOpts);
        job = createdJob;

        const [
          rows,
        ] = await job.getQueryResults();

        if (rows.length === 0) {
          console.log(`
            No records found in the target table, will start scanning from the beginning
          `);
          return;
        }

        const startingRow = rows.pop();
        return startingRow[this.uniqueKey];
      } finally {
        // CRITICAL: Clean up ALL BigQuery resources to prevent memory leaks
        if (job) {
          try {
            console.log("Cleaning up BigQuery job resources in _getIdOfLastRow...");
            await job.cancel();
            job.removeAllListeners && job.removeAllListeners();

            // Also clean up the BigQuery client instance
            const bigQueryClient = this.googleCloud.getBigQueryClient();
            if (bigQueryClient && typeof bigQueryClient.close === "function") {
              await bigQueryClient.close();
            }
          } catch (cleanupError) {
            console.warn("Warning: Error during BigQuery job cleanup in _getIdOfLastRow:", cleanupError.message);
          }
        }
      }
    },
    getQueryOpts() {
      const lastResultId = this._getLastResultId();
      const maxRowsPerExecution = this.maxRowsPerExecution || 5000;

      let query = `
        SELECT *
        FROM \`${this.tableId}\`
      `;
      if (lastResultId) {
        query += ` WHERE \`${this.uniqueKey}\` >= @lastResultId`;
      }
      query += ` ORDER BY \`${this.uniqueKey}\` ASC`;
      query += " LIMIT @maxRows";

      const params = {
        maxRows: maxRowsPerExecution,
        ...(lastResultId
          ? {
            lastResultId,
          }
          : {}),
      };

      return {
        query,
        params,
        jobConfig: {
          // Add timeout to prevent runaway queries
          jobTimeoutMs: 300000, // 5 minutes
          maximumBytesBilled: "1000000000", // 1GB limit to prevent excessive costs
        },
      };
    },
    generateMeta(row, ts) {
      const id = row[this.uniqueKey];
      const summary = `New row: ${id}`;
      return {
        id,
        summary,
        ts,
      };
    },
    generateMetaForCollection(rows, ts) {
      const hash = crypto.createHash("sha1");
      rows
        .map((i) => i[this.uniqueKey])
        .map((i) => i.toString())
        .forEach((i) => hash.update(i));
      const id = hash.digest("base64");

      const rowCount = rows.length;
      const entity = rowCount === 1
        ? "row"
        : "rows";
      const summary = `${rowCount} new ${entity}`;

      return {
        id,
        summary,
        ts,
      };
    },
  },
};
