import { ConfigurationError } from "@pipedream/platform";
import app from "../../bunnycdn.app.mjs";

export default {
  key: "bunnycdn-get-statistics",
  name: "Get Statistics",
  description: "Get traffic statistics for your account or for one pull zone, including bandwidth used, requests served and cache hit rate."
    + " Covers the last 30 days unless you set a date range."
    + " [See the documentation](https://bunny.net/docs/api-reference/core/statistics/get-statistics)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    pullZoneId: {
      propDefinition: [
        app,
        "pullZoneId",
      ],
      description: "Only return statistics for this pull zone, e.g. `123456`. Leave it empty for the whole account. Use **List Pull Zones** to find it (the `Id` field).",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "The start of the period as an ISO 8601 date-time, e.g. `2026-10-01T00:00:00Z`. Set it together with **Date To**.",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "The end of the period as an ISO 8601 date-time, e.g. `2026-10-31T23:59:59Z`. Set it together with **Date From**.",
      optional: true,
    },
    hourly: {
      type: "boolean",
      label: "Hourly",
      description: "Group the chart data by hour instead of by day, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (Boolean(this.dateFrom) !== Boolean(this.dateTo)) {
      throw new ConfigurationError("Set both **Date From** and **Date To**, or leave both empty.");
    }
    const statistics = await this.app.getStatistics({
      $,
      params: {
        pullZone: this.pullZoneId,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        hourly: this.hourly,
        loadBandwidthUsed: true,
        loadRequestsServed: true,
        loadOriginTraffic: true,
      },
    });
    $.export("$summary", `Retrieved statistics: ${statistics.TotalRequestsServed} requests served`);
    return statistics;
  },
};
