import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-monitor-chart",
  name: "Get Monitor Chart",
  description: "Get chart data for a specific monitor over a date range. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: true,
    destructiveHint: false,
  },
  props: {
    pubrio,
    monitorId: {
      type: "string",
      label: "Monitor ID",
      description: "The monitor ID to get chart data for",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date for the chart range (e.g. 2024-01-01)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date for the chart range (e.g. 2024-12-31)",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.getMonitorChart({
      $,
      data: {
        monitor_id: this.monitorId,
        start_date: this.startDate,
        end_date: this.endDate,
      },
    });
    $.export("$summary", "Successfully retrieved monitor chart data");
    return response;
  },
};
