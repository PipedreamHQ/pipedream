import {
  SORT_OPTIONS,
  TIMESPAN_OPTIONS,
} from "../../common/constants.mjs";
import polygon from "../../polygon.app.mjs";

export default {
  key: "polygon-get-historical-prices",
  name: "Get Historical Prices",
  description: "Fetches historical price data for a specified stock ticker within a date range. [See the documentation](https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__range__multiplier___timespan___from___to)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    polygon,
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    multiplier: {
      type: "integer",
      label: "Multiplier",
      description: "The size of the timespan multiplier.",
      default: 1,
    },
    timespan: {
      type: "string",
      label: "Timespan",
      description: "The size of the time window.",
      options: TIMESPAN_OPTIONS,
    },
    from: {
      type: "string",
      label: "From Date",
      description: "The start of the aggregate time window. Either a date with the format **YYYY-MM-DD** or a millisecond timestamp.",
    },
    to: {
      type: "string",
      label: "To Date",
      description: "The end of the aggregate time window. Either a date with the format **YYYY-MM-DD** or a millisecond timestamp.",
    },
    adjusted: {
      propDefinition: [
        polygon,
        "adjusted",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort the results by timestamp. asc will return results in ascending order (oldest at the top), desc will return results in descending order (newest at the top).",
      options: SORT_OPTIONS,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limits the number of base aggregates queried to create the aggregate results. Max 50000 and Default 5000. Read more about how limit is used to calculate aggregate results in our article on [Aggregate Data API Improvements](https://polygon.io/blog/aggs-api-updates).",
      optional: true,
      min: 1,
      max: 50000,
      default: 5000,
    },
  },
  async run({ $ }) {
    const response = await this.polygon.getHistoricalPriceData({
      $,
      stockTicker: this.stockTicker,
      multiplier: this.multiplier,
      timespan: this.timespan,
      from: this.from,
      to: this.to,
      params: {
        adjusted: this.adjusted,
        sort: this.sort,
        limit: this.limit,
      },
    });
    $.export("$summary", `Fetched historical prices for ${this.stockTicker} from ${this.from} to ${this.to}.`);
    return response;
  },
};
