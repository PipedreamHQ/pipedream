// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { PerformanceParams } from "../../common/requestParams";
import { DAILY_METRIC_OPTIONS } from "../../common/constants";
import { parseDate } from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations/getDailyMetricsTimeSeries";

export default defineAction({
  key: "google_my_business-get-daily-metrics-time-series",
  name: "Get Daily Metrics Time Series",
  description: `Get the values for a single performance metric of a location, aggregated by day over a date range. Use **Get Multiple Daily Metrics Time Series** to fetch several metrics in one call, and **List Search Keyword Impressions** for the search terms driving that traffic. [See the documentation](${DOCS_LINK})`,
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
    dailyMetric: {
      type: "string",
      label: "Daily Metric",
      description: "The metric to retrieve, e.g. `CALL_CLICKS` or `WEBSITE_CLICKS`.",
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
      location, dailyMetric, startDate, endDate,
    } = this;

    const start = parseDate(startDate, "Start Date");
    const end = parseDate(endDate, "End Date");

    const params: PerformanceParams = {
      $,
      location,
      params: {
        dailyMetric,
        "dailyRange.start_date.year": start.year,
        "dailyRange.start_date.month": start.month,
        "dailyRange.start_date.day": start.day,
        "dailyRange.end_date.year": end.year,
        "dailyRange.end_date.month": end.month,
        "dailyRange.end_date.day": end.day,
      },
    };

    const response = await this.app.getDailyMetricsTimeSeries(params);
    const count = response?.timeSeries?.datedValues?.length ?? 0;

    $.export("$summary", `Successfully retrieved ${count} daily value${count !== 1
      ? "s"
      : ""} for ${dailyMetric}`);

    return response;
  },
});
