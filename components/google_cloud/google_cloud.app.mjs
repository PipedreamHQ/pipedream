/* eslint-disable camelcase */
import { Logging } from "@google-cloud/logging";
import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import {
  ZonesClient,
  ZoneOperationsClient,
  InstancesClient,
} from "@google-cloud/compute";
import { v1 as bqdt } from "@google-cloud/bigquery-data-transfer";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_cloud",
  propDefinitions: {
    zoneName: {
      label: "Zone",
      description: "The unique zone name",
      type: "string",
      async options() {
        const zones = await this.listZones();
        return zones.map((item) => (item.name));
      },
    },
    instanceName: {
      label: "Instance Name",
      description: "The unique instance name",
      type: "string",
      async options({ zone }) {
        if (!zone) { return []; }
        const instances = await this.listVmInstancesByZone(zone);
        return instances.map((item) => (item.name));
      },
    },
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
    bigQueryDataTransferClient() {
      return new bqdt.DataTransferServiceClient(this.sdkParams());
    },
    loggingClient() {
      return new Logging(this.sdkParams());
    },
    storageClient() {
      return new Storage(this.sdkParams());
    },
    instancesClient() {
      return new InstancesClient(this.sdkParams());
    },
    zoneOperationsClient() {
      return new ZoneOperationsClient(this.sdkParams());
    },
    zonesClient() {
      return new ZonesClient(this.sdkParams());
    },
    async listVmInstancesByZone(zone) {
      const instancesClient = this.instancesClient();
      const sdkParams = this.sdkParams();
      const [
        instances,
      ] = await instancesClient.list({
        project: sdkParams.projectId,
        zone,
      });
      return instances;
    },
    async listZones() {
      const zonesClient = this.zonesClient();
      const sdkParams = this.sdkParams();
      const [
        zones,
      ] = await zonesClient.list({
        project: sdkParams.projectId,
      });
      return zones;
    },
    async switchInstanceBootStatus(zone, instance, newStatus) {
      if (![
        "start",
        "stop",
      ].includes(newStatus)) {
        throw new ConfigurationError("The new VM boot status must be 'start' or 'stop'.");
      }
      const instancesClient = this.instancesClient();
      const sdkParams = this.sdkParams();
      const [
        response,
      ] = await instancesClient[newStatus]({
        project: sdkParams.projectId,
        zone,
        instance,
      });
      return response.latestResponse;
    },
    async waitOperation(operation) {
      const operationsClient = this.zoneOperationsClient();
      const sdkParams = this.sdkParams();
      while (operation.status !== "DONE") {
        [
          operation,
        ] = await operationsClient.wait({
          operation: operation.name,
          project: sdkParams.projectId,
          zone: operation.zone.split("/").pop(),
        });
      }
      return operation;
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
