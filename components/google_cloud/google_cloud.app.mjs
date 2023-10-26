import { axios } from "@pipedream/platform";
import { Logging } from "@google-cloud/logging";
import { Storage } from "@google-cloud/storage";
import { BigQuery } from "@google-cloud/bigquery";
import {
  ZonesClient, ZoneOperationsClient, InstancesClient,
} from "@google-cloud/compute";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_cloud",
  propDefinitions: {
    zoneName: {
      type: "string",
      label: "Zone",
      description: "The unique zone name",
      async options() {
        const zones = await this.listZones();
        return zones.map((item) => (item.name));
      },
    },
    instanceName: {
      type: "string",
      label: "Instance Name",
      description: "The unique instance name",
      async options({ zone }) {
        if (!zone) { return []; }
        const instances = await this.listVmInstancesByZone(zone);
        return instances.map((item) => (item.name));
      },
    },
    bucketName: {
      type: "string",
      label: "Bucket Name",
      description: "The unique bucket name",
      async options() {
        const [
          resp,
        ] = await this.storageClient().getBuckets();
        return resp.map((bucket) => bucket.id);
      },
    },
    fileNames: {
      type: "string[]",
      label: "fileName",
      description: "File names to be selected in GCS bucket",
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
    queryString: {
      type: "string",
      label: "Query",
      description: "The GoogleSQL query to execute",
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "The schedule on which the query should run. The syntax is crontab-like: 'every N (hours|mins|minutes) [from time1 to time2]'",
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
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    _baseUrl() {
      return "https://bigquerydatatransfer.googleapis.com/v1";
    },
    async createTransferConfig(parent, transferConfig, authorizationCode) {
      return this._makeRequest({
        path: `/projects/${parent}/locations/us/transferConfigs`,
        data: {
          parent,
          transferConfig,
          authorizationCode,
        },
      });
    },
  },
};
