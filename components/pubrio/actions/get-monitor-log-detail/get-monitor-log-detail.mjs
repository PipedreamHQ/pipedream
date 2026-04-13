import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-log-detail",
  name: "Get Monitor Log Detail",
  description: "Get detailed information about a specific monitor log entry. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/monitors/statistics_logs_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    monitorLogId: {
      type: "string",
      label: "Monitor Log ID",
      description: "The monitor log ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.getMonitorLogDetail({
      $,
      data: {
        monitor_log_id: this.monitorLogId,
      },
    });
    $.export("$summary", `Successfully retrieved monitor log detail ${this.monitorLogId}`);
    return response;
  },
};
