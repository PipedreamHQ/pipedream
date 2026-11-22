import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { DAILY_METRIC_OPTIONS } from "../../common/constants";
import {
  dailyRangeParams, flattenTimeSeries, formatDate, parseDailyRange, parseLocationId,
} from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations/fetchMultiDailyMetricsTimeSeries";

interface MultiResponse {
  multiDailyMetricTimeSeries?: {
    dailyMetricTimeSeries?: {
      dailyMetric: string;
      timeSeries?: Parameters<typeof flattenTimeSeries>[0];
    }[];
  }[];
}

export default defineAction({
  key: "google_my_business-get-multiple-daily-metrics-time-series",
  name: "Get Multiple Daily Metrics Time Series",
  description: "Get several performance metrics of a Business Profile location for each day in one date range, in a single request."
    + " Use it to compare or combine metrics, such as calls against direction requests, or to add up the four profile-view metrics."
    + " For a single metric, use **Get Daily Metrics Time Series** instead; for the search terms people used, use **List Search Keyword Impressions**."
    + " Use **List Locations** first to get the location ID. A day Google has no figure for comes back with `value` null, and totals count it as 0."
    + " Returns the location, the range and `metrics`, a list with one entry per requested metric holding its `dailyMetric`, `total` and `datedValues` (`{ date, value }` per day)."
    + " Example: `locationId=9876543210`, `dailyMetrics=[\"CALL_CLICKS\", \"WEBSITE_CLICKS\"]`, `startDate=2026-03-01`, `endDate=2026-03-07` → two series of 7 daily counts, each with a total."
    + ` [See the documentation](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "performanceLocationId",
      ],
    },
    dailyMetrics: {
      type: "string[]",
      label: "Metrics",
      description: "The metrics to fetch, e.g. `[\"CALL_CLICKS\", \"BUSINESS_DIRECTION_REQUESTS\"]`. Pass at least one.",
      options: DAILY_METRIC_OPTIONS,
    },
    startDate: {
      propDefinition: [
        app,
        "performanceStartDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "performanceEndDate",
      ],
    },
  },
  async run({ $ }) {
    const locationId = parseLocationId(this.locationId);
    const dailyMetrics: string[] = this.dailyMetrics ?? [];
    if (!dailyMetrics.length) {
      throw new Error("`Metrics` needs at least one metric, e.g. `[\"CALL_CLICKS\"]`");
    }
    const {
      start, end,
    } = parseDailyRange(this.startDate, this.endDate);

    const response: MultiResponse = await this.app.fetchMultiDailyMetricsTimeSeries({
      $,
      locationId,
      dailyMetrics,
      params: dailyRangeParams(start, end),
    });

    const metrics = (response?.multiDailyMetricTimeSeries ?? [])
      .flatMap((group) => group.dailyMetricTimeSeries ?? [])
      .map(({
        dailyMetric, timeSeries,
      }) => ({
        dailyMetric,
        ...flattenTimeSeries(timeSeries),
      }));

    $.export("$summary", `Fetched ${metrics.length} metric${metrics.length === 1
      ? ""
      : "s"} for ${formatDate(start)} to ${formatDate(end)}`);

    return {
      location: `locations/${locationId}`,
      startDate: formatDate(start),
      endDate: formatDate(end),
      metrics,
    };
  },
});
