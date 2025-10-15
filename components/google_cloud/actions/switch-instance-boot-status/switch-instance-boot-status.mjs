import googleCloud from "../../google_cloud.app.mjs";
import {
  ZonesClient,
  ZoneOperationsClient,
  InstancesClient,
} from "@google-cloud/compute";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Switch Instance Boot Status",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-switch-instance-boot-status",
  type: "action",
  description: "Switch a virtual machine instance boot status to start or stop it. [See the documentation](https://cloud.google.com/compute/docs/instances/stop-start-instance)",
  props: {
    googleCloud,
    zone: {
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
    newInstanceStatus: {
      label: "New Instance Status",
      description: "Select if the instance should be either switched to started or stopped status",
      type: "string",
      options: [
        "start",
        "stop",
      ],
    },
    waitCompletion: {
      label: "Wait Completion",
      description: "Wait until the end of the operation",
      type: "boolean",
      default: false,
    },
  },
  methods: {
    zonesClient() {
      return new ZonesClient(this.googleCloud.sdkParams());
    },
    zoneOperationsClient() {
      return new ZoneOperationsClient(this.googleCloud.sdkParams());
    },
    instancesClient() {
      return new InstancesClient(this.googleCloud.sdkParams());
    },
    async listZones() {
      const zonesClient = this.zonesClient();
      const sdkParams = this.googleCloud.sdkParams();
      const [
        zones,
      ] = await zonesClient.list({
        project: sdkParams.projectId,
      });
      return zones;
    },
    async waitOperation(operation) {
      const operationsClient = this.zoneOperationsClient();
      const sdkParams = this.googleCloud.sdkParams();
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
    async listVmInstancesByZone(zone) {
      const instancesClient = this.instancesClient();
      const sdkParams = this.googleCloud.sdkParams();
      const [
        instances,
      ] = await instancesClient.list({
        project: sdkParams.projectId,
        zone,
      });
      return instances;
    },
    async switchInstanceBootStatus(zone, instance, newStatus) {
      if (![
        "start",
        "stop",
      ].includes(newStatus)) {
        throw new ConfigurationError("The new VM boot status must be 'start' or 'stop'.");
      }
      const instancesClient = this.instancesClient();
      const sdkParams = this.googleCloud.sdkParams();
      const [
        response,
      ] = await instancesClient[newStatus]({
        project: sdkParams.projectId,
        zone,
        instance,
      });
      return response.latestResponse;
    },
  },
  async run({ $ }) {
    const {
      zone,
      instanceName,
      waitCompletion,
      newInstanceStatus,
    } = this;

    let operation = await this.switchInstanceBootStatus(
      zone,
      instanceName,
      newInstanceStatus,
    );

    if (waitCompletion) {
      operation = await this.waitOperation(operation);
    }

    $.export("$summary", `Instance ${instanceName} boot status was set to ${newInstanceStatus}.`);
    return operation;
  },
};
