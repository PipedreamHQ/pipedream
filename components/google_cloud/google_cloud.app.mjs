/* eslint-disable camelcase */
import { Logging } from "@google-cloud/logging";
import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";

export default {
  type: "app",
  app: "google_cloud",
  propDefinitions: {
    bucketName: {
      label: "Bucket Name",
      description: "The unique bucket name",
      type: "string",
      async options() {
        const [
          resp,
        ] = await this.storageClient().getBuckets();
        return resp.map((bucket) => bucket.id);
      },
    },
    fileNames: {
      label: "fileName",
      description: "File names to be selected in GCS bucket",
      type: "string[]",
      async options({
        bucketName,
        prevContext,
      }) {
        const prevToken = prevContext.nextToken ?? {
          autoPaginate: false,
        };
        const bucket = this.storageClient().bucket(bucketName);
        const [
          files,
          nextToken,
        ] = await bucket.getFiles(prevToken);
        return prevToken ?
          {
            options: files.map((file) => file.name),
            context: {
              nextToken,
            },
          } :
          [];
      },
    },
    datasetId: {
      type: "string",
      label: "Dataset ID",
      description: "The BigQuery dataset against which queries will be executed",
      async options({ page }) {
        if (page) {
          return [];
        }

        const client = this.getBigQueryClient();
        const [
          datasets,
        ] = await client.getDatasets();
        return datasets.map(({ id }) => id);
      },
    },
    tableId: {
      type: "string",
      label: "Table Name",
      description: "The name of the table to watch for new rows",
      async options({
        page, datasetId,
      }) {
        if (page) {
          return [];
        }

        const client = this
          .getBigQueryClient()
          .dataset(datasetId);
        const [
          tables,
        ] = await client.getTables();
        return tables.map(({ id }) => id);
      },
    },
  },
  methods: {
    authKeyJson() {
      return JSON.parse(this.$auth.key_json);
    },
    sdkParams() {
      const {
        project_id: projectId,
        client_email,
        private_key,
      } = this.authKeyJson();
      const credentials = {
        client_email,
        private_key,
      };
      return {
        credentials,
        projectId,
      };
    },
    loggingClient() {
      return new Logging(this.sdkParams());
    },
    storageClient() {
      return new Storage(this.sdkParams());
    },
    getBigQueryClient() {
      const credentials = this.authKeyJson();
      const { project_id: projectId } = credentials;
      return new BigQuery({
        credentials,
        projectId,
      });
    },
  },
};
