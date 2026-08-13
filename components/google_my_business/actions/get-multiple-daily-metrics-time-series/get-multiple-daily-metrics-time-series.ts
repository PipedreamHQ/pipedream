// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../app/google_my_business.app";
import { PerformanceParams } from "../../common/requestParams";
import { DAILY_METRIC_OPTIONS } from "../../common/constants";
import { parseDate } from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations/fetchMultiDailyMetricsTimeSeries";
const MAX_METRICS = 10;

export default defineAction({
  key: "google_my_business-get-multiple-daily-metrics-time-series",
  name: "Get Multiple Daily Metrics Time Series",
  description: `Get the values for several performance metrics of a location over the same date range in a single call, e.g. views and calls together. Use **Get Daily Metrics Time Series** instead when only one metric is needed. [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    dailyMetrics: {
      type: "string[]",
      label: "Daily Metrics",
      description: `Up to ${MAX_METRICS} metrics to retrieve, e.g. \`CALL_CLICKS\` and \`WEBSITE_CLICKS\`.`,
      options: DAILY_METRIC_OPTIONS,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start of the date range, in `YYYY-MM-DD` format (e.g. `2026-01-01`). The range must not exceed 18 months and cannot start before 2021-01-01.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End of the date range, in `YYYY-MM-DD` format (e.g. `2026-01-31`).",
    },
  },
  async run({ $ }) {
    const {
      location, dailyMetrics, startDate, endDate,
    } = this;

    if (dailyMetrics?.length > MAX_METRICS) {
      throw new ConfigurationError(`**Daily Metrics** accepts at most ${MAX_METRICS} metrics. Received ${dailyMetrics.length}.`);
    }

    const start = parseDate(startDate, "Start Date");
    const end = parseDate(endDate, "End Date");

    const params: PerformanceParams = {
      $,
      location,
      params: {
        dailyMetrics,
        "dailyRange.start_date.year": start.year,
        "dailyRange.start_date.month": start.month,
        "dailyRange.start_date.day": start.day,
        "dailyRange.end_date.year": end.year,
        "dailyRange.end_date.month": end.month,
        "dailyRange.end_date.day": end.day,
      },
    };

    const response = await this.app.fetchMultiDailyMetricsTimeSeries(params);
    const count = response?.multiDailyMetricTimeSeries?.length ?? 0;

    $.export("$summary", `Successfully retrieved time series for ${count} metric${count !== 1
      ? "s"
      : ""}`);

    return response;
  },
});
