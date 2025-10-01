import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Switch Instance Boot Status",
  version: "0.0.3",
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
      propDefinition: [
        googleCloud,
        "zoneName",
      ],
    },
    instanceName: {
      propDefinition: [
        googleCloud,
        "instanceName",
        ({ zone }) => ({
          zone,
        }),
      ],
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
  async run({ $ }) {
    const {
      zone,
      instanceName,
      waitCompletion,
      newInstanceStatus,
    } = this;

    let operation = await this.googleCloud.switchInstanceBootStatus(
      zone,
      instanceName,
      newInstanceStatus,
    );

    if (waitCompletion) {
      operation = await this.googleCloud.waitOperation(operation);
    }

    $.export("$summary", `Instance ${instanceName} boot status was set to ${newInstanceStatus}.`);
    return operation;
  },
};
