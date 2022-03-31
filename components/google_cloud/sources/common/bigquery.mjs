/* eslint-disable camelcase */
import { BigQuery } from "@google-cloud/bigquery";
import { GoogleAuth } from "google-auth-library";
import { chunk } from "lodash-es";
import google_cloud from "../../google_cloud.app.mjs";

export default {
  props: {
    google_cloud,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often to run your query",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
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
      type: "string",
      label: "Dataset",
      description: "The BigQuery dataset against which queries will be executed",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const client = this.getBigQueryClient();
        const [
          datasets,
        ] = await client.getDatasets();
        return datasets.map(({ id }) => id);
      },
    },
  },
  methods: {
    _getBigQueryClientOpts() {
      const credentials = this.google_cloud.authKeyJson();
      const scopes = [
        "https://www.googleapis.com/auth/bigquery",
        // Needed for datasets that were built from a Google Sheet
        "https://www.googleapis.com/auth/drive.readonly",
      ];
      const authOpts = {
        credentials,
        scopes,
        projectId: credentials.project_id,
      };
      const authClient = new GoogleAuth(authOpts);
      return {
        authClient,
      };
    },
    getBigQueryClient() {
      const clientOpts = this._getBigQueryClientOpts();
      return new BigQuery(clientOpts);
    },
    async getRowsForQuery(queryOpts) {
      const client = this
        .getBigQueryClient()
        .dataset(this.datasetId);
      const [
        job,
      ] = await client.createQueryJob(queryOpts);
      const [
        rows,
      ] = await job.getQueryResults();
      return rows;
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
      const rows = await this.getRowsForQuery(queryOpts);
      chunk(rows, this.eventSize)
        .forEach((rows) => {
          const meta = this.generateMetaForCollection(rows, timestamp);
          const rowCount = rows.length;
          const data = {
            rows,
            rowCount,
          };
          this.$emit(data, meta);
        });
      if (this.uniqueKey) this._updateLastResultId(rows);
    },
    async processSingle(queryOpts, timestamp) {
      const rows = await this.getRowsForQuery(queryOpts);
      rows.forEach((row) => {
        const meta = this.generateMeta(row, timestamp);
        this.$emit(row, meta);
      });
      if (this.uniqueKey) this._updateLastResultId(rows);
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
    return (this.eventSize === 1) ?
      this.processSingle(queryOpts, timestamp) :
      this.processCollection(queryOpts, timestamp);
  },
};
