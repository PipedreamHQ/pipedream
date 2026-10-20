import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-time-series",
  name: "Get Time Series",
  description: "Gets the visitors, visits and pageviews of a site for each hour, day, week or month of a period, one item for each point. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": true,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    period: {
      propDefinition: [
        app,
        "period",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Bucket size: minute, hour, day, week, month, quarter or year. auto picks one that suits the range.",
      options: [
        "auto",
        "minute",
        "hour",
        "day",
        "week",
        "month",
        "quarter",
        "year",
      ],
      default: "day",
      optional: true,
    },
    filters: {
      propDefinition: [
        app,
        "filters",
      ],
    },
    segmentId: {
      propDefinition: [
        app,
        "segmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "GET",
      path: `/sites/${utils.segment(this.siteId)}/stats/timeseries.json`,
      params: utils.compact({
        period: this.period,
        from: this.period === "custom"
          ? utils.toDate(this.from)
          : undefined,
        to: this.period === "custom"
          ? utils.toDate(this.to)
          : undefined,
        interval: this.interval,
        filters: utils.parseJson(this.filters, "Filters"),
        segment_id: this.segmentId,
      }),
    });
    const series = response.series || [];
    $.export("$summary", `Successfully retrieved ${series.length} point${series.length === 1
      ? ""
      : "s"}`);
    return series;
  },
};
