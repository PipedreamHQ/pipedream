import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-log-detail",
  name: "Get Monitor Log Detail",
  description: "Get detailed information about a specific monitor log entry. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
    monitorLogId: {
      type: "string",
      label: "Monitor Log ID",
      description: "The monitor log ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/monitors/statistics/logs/lookup",
      data: { monitor_log_id: this.monitorLogId },
    });
    $.export("$summary", "Successfully retrieved monitor log detail");
    return response;
  },
};
