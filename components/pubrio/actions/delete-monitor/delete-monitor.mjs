import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-delete-monitor",
  name: "Delete Monitor",
  description: "Delete an existing signal monitor. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/delete)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to delete",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.deleteMonitor({
      $,
      data: {
        monitor_id: this.monitorId,
      },
    });
    $.export("$summary", `Successfully deleted monitor ${this.monitorId}`);
    return response;
  },
};
