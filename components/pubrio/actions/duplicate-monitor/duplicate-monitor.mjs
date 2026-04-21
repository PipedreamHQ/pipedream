import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-duplicate-monitor",
  name: "Duplicate Monitor",
  description: "Duplicate an existing signal monitor. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/duplicate)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to duplicate",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name for the duplicated monitor",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      monitor_id: this.monitorId,
    };
    if (this.name) data.name = this.name;
    const response = await this.pubrio.duplicateMonitor({
      $,
      data,
    });
    $.export("$summary", `Successfully duplicated monitor ${this.monitorId}`);
    return response;
  },
};
