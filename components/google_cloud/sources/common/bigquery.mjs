/* eslint-disable camelcase */
import { chunk } from "lodash-es";
import googleCloud from "../../google_cloud.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleCloud,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to run your query",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    eventSize: {
      type: "integer",
      label: "Event Size",
      description: "The number of rows to include in a single event (by default, emits 1 event per row)",
      default: 1,
      min: 1,
      max: 1000,
    },
    maxRowsPerExecution: {
      type: "integer",
      label: "Max Rows Per Execution",
      description: "Maximum number of rows to process in a single execution to prevent memory issues",
      default: 5000,
      min: 100,
      max: 50000,
      optional: true,
    },
    datasetId: {
      propDefinition: [
        googleCloud,
        "datasetId",
      ],
    },
  },
  methods: {
    _updateLastResultId(rows) {
      const lastRow = rows.pop();
      if (!lastRow) {
        console.log("No new rows found since last execution");
        return;
      }

      const newLastResultId = lastRow[this.uniqueKey];
      this.db.set("lastResultId", newLastResultId);
    },
    async processCollection(queryOpts, timestamp) {
      const client = this.googleCloud
        .getBigQueryClient()
        .dataset(this.datasetId);
      const [
        job,
      ] = await client.createQueryJob(queryOpts);

      const pageSize = 100;
      const maxRowsPerExecution = this.maxRowsPerExecution || 5000;
      const maxPages = Math.ceil(maxRowsPerExecution / pageSize);
      let pageToken = null;
      let allProcessed = false;
      let pageCount = 0;
      let totalRowsProcessed = 0;

      console.log(`Starting BigQuery processing with max ${maxRowsPerExecution} rows per execution`);

      while (!allProcessed) {
        try {
          const options = {
            maxResults: pageSize,
          };

          if (pageToken) {
            options.pageToken = pageToken;
          }

          const [
            rows,
            queryResults,
          ] = await job.getQueryResults(options);
          const nextPageToken = queryResults?.pageToken;

          if (rows.length === 0) {
            allProcessed = true;
            break;
          }

          // Check memory limits before processing
          totalRowsProcessed += rows.length;
          if (totalRowsProcessed > maxRowsPerExecution) {
            console.log(`Reached max rows limit (${maxRowsPerExecution}). Stopping processing to prevent memory issues.`);
            allProcessed = true;
            break;
          }

          // Process rows immediately and in small chunks to reduce memory usage
          chunk(rows, this.eventSize).forEach((batch) => {
            try {
              if (this.eventSize === 1) {
                const meta = this.generateMeta(batch[0], timestamp);
                this.$emit(batch[0], meta);
              } else {
                const meta = this.generateMetaForCollection(batch, timestamp);
                const data = {
                  rows: batch,
                  rowCount: batch.length,
                };
                this.$emit(data, meta);
              }
            } catch (error) {
              console.error("Error processing batch:", error);
              throw error;
            }
          });

          // Update last result ID before clearing rows
          if (this.uniqueKey && rows.length > 0) {
            this._updateLastResultId([
              ...rows,
            ]); // Pass a copy to avoid mutation issues
          }

          // Clear reference to help with garbage collection
          rows.length = 0;

          pageCount++;
          if (pageCount >= maxPages) {
            console.log(`Reached max pages limit (${maxPages}). Stopping processing.`);
            allProcessed = true;
          }
          if (!nextPageToken) {
            break;
          }
          pageToken = nextPageToken;
        } catch (error) {
          console.error("Error in BigQuery processing:", error);
          if (error.message && error.message.includes("memory")) {
            throw new Error(`Memory error in BigQuery processing. Consider reducing maxRowsPerExecution or eventSize. Original error: ${error.message}`);
          }
          throw error;
        }
      }

      console.log(`BigQuery processing completed. Processed ${totalRowsProcessed} rows in ${pageCount} pages.`);
    },
    getInitialEventCount() {
      return 10;
    },
    getQueryOpts() {
      throw new Error("getQueryOpts is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateMetaForCollection() {
      throw new Error("generateMetaForCollection is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  run(event) {
    const { timestamp } = event;
    const queryOpts = this.getQueryOpts(event);
    return this.processCollection(queryOpts, timestamp);
  },
};
