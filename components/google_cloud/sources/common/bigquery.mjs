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
    },
    datasetId: {
      propDefinition: [
        googleCloud,
        "datasetId",
      ],
    },
  },
  methods: {
    async createQueryJob(queryOpts) {
      const client = this.googleCloud
        .getBigQueryClient()
        .dataset(this.datasetId);
      const [
        job,
      ] = await client.createQueryJob(queryOpts);
      return job;
    },
    async getRowsForQuery(job, pageSize = 1000, pageToken = null) {
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
      return {
        rows,
        pageToken: nextPageToken,
      };
    },
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
      const job = await this.createQueryJob(queryOpts);

      const pageSize = 1000, maxPages = 10;
      let pageToken = null;
      let allProcessed = false;
      let pageCount = 0;

      while (!allProcessed) {
        const {
          rows, pageToken: nextPageToken,
        } = await this.getRowsForQuery(job, pageSize, pageToken);

        if (rows.length === 0) {
          allProcessed = true;
          break;
        }

        chunk(rows, this.eventSize).forEach((batch) => {
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
        });

        pageCount++;
        if (pageCount >= maxPages) {
          allProcessed = true;
        }
        if (this.uniqueKey) {
          this._updateLastResultId(rows);
        }
        if (!nextPageToken) {
          break;
        }
        pageToken = nextPageToken;
      }
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
