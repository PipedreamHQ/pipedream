import { defineAction } from "@pipedream/types";
import app from "../../app/google_my_business.app";
import { DAILY_METRIC_OPTIONS } from "../../common/constants";
import {
  dailyRangeParams, flattenTimeSeries, formatDate, parseDailyRange, parseLocationId,
} from "../../common/utils";

const DOCS_LINK = "https://developers.google.com/my-business/reference/performance/rest/v1/locations/getDailyMetricsTimeSeries";

export default defineAction({
  key: "google_my_business-get-daily-metrics-time-series",
  name: "Get Daily Metrics Time Series",
  description: "Get one performance metric of a Business Profile location for each day in a date range, such as website clicks, call clicks or direction requests."
    + " Use it for questions like \"how many people asked for directions each day in March?\"."
    + " To fetch several metrics in the same call, use **Get Multiple Daily Metrics Time Series** instead; for the search terms people used, use **List Search Keyword Impressions**."
    + " Use **List Locations** first to get the location ID. A day Google has no figure for comes back with `value` null, and the total counts it as 0."
    + " Returns the location, metric, range, the `total` and `datedValues`, a list of `{ date, value }` with one entry per day."
    + " Example: `locationId=9876543210`, `dailyMetric=CALL_CLICKS`, `startDate=2026-03-01`, `endDate=2026-03-07` → a total and 7 daily call-click counts."
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
    dailyMetric: {
      type: "string",
      label: "Metric",
      description: "The metric to fetch one value per day for, e.g. `WEBSITE_CLICKS`. Profile views are split by surface and device (Search or Maps, desktop or mobile); to get all views, fetch each of the four `BUSINESS_IMPRESSIONS_*` metrics with **Get Multiple Daily Metrics Time Series** and add them up.",
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
    const {
      start, end,
    } = parseDailyRange(this.startDate, this.endDate);

    const response: {
      timeSeries?: Parameters<typeof flattenTimeSeries>[0];
    } = await this.app.getDailyMetricsTimeSeries({
      $,
      locationId,
      params: {
        dailyMetric: this.dailyMetric,
        ...dailyRangeParams(start, end),
      },
    });
    const {
      total, datedValues,
    } = flattenTimeSeries(response?.timeSeries);

    $.export("$summary", `Fetched ${datedValues.length} days of ${this.dailyMetric} (total ${total})`);

    return {
      location: `locations/${locationId}`,
      dailyMetric: this.dailyMetric,
      startDate: formatDate(start),
      endDate: formatDate(end),
      total,
      datedValues,
    };
  },
});
