import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-site-stats",
  name: "Get Site Stats",
  description: "Gets the visitors, visits, pageviews, bounce rate, visit duration and revenue of a site for a period, optionally compared with an earlier one. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    compare: {
      type: "string",
      label: "Compare",
      description: "Also compute a comparison range: previous_period (the same length right before), previous_year (the same dates a year earlier), custom (needs both compare_from and compare_to) or none. Adds the comparison values and the percent change to the result.",
      options: [
        "none",
        "previous_period",
        "previous_year",
        "custom",
      ],
      default: "none",
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
    includeImported: {
      type: "boolean",
      label: "Include Imported",
      description: "Add imported historical data (dates before the first native event, ignored when filters or a segment are applied).",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "GET",
      path: `/sites/${utils.segment(this.siteId)}/stats/aggregate.json`,
      params: utils.compact({
        period: this.period,
        from: this.period === "custom"
          ? utils.toDate(this.from)
          : undefined,
        to: this.period === "custom"
          ? utils.toDate(this.to)
          : undefined,
        compare: this.compare,
        filters: utils.parseJson(this.filters, "Filters"),
        segment_id: this.segmentId,
        include_imported: this.includeImported,
      }),
    });
    $.export("$summary", `Successfully retrieved the stats of the site for the period ${response.period.from} to ${response.period.to}`);
    return response;
  },
};
