import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-get-top-values",
  name: "Get Top Values",
  description: "Gets the top values of one report (pages, referrers, campaigns, countries, devices, events, goals and more) for a period, one item for each row. [See the documentation](https://privatusanalytics.com/docs/api)",
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
    dimension: {
      type: "string",
      label: "Report",
      description: "What to group by. For **Custom Event Property** fill in **Property Key**.",
      options: [
        {
          "label": "Page",
          "value": "page",
        },
        {
          "label": "Entry Page",
          "value": "entry_page",
        },
        {
          "label": "Exit Page",
          "value": "exit_page",
        },
        {
          "label": "Channel",
          "value": "channel",
        },
        {
          "label": "Referrer",
          "value": "referrer",
        },
        {
          "label": "UTM Source",
          "value": "utm_source",
        },
        {
          "label": "UTM Medium",
          "value": "utm_medium",
        },
        {
          "label": "UTM Campaign",
          "value": "utm_campaign",
        },
        {
          "label": "UTM Content",
          "value": "utm_content",
        },
        {
          "label": "UTM Term",
          "value": "utm_term",
        },
        {
          "label": "Country",
          "value": "country",
        },
        {
          "label": "Language",
          "value": "language",
        },
        {
          "label": "Device",
          "value": "device",
        },
        {
          "label": "Browser",
          "value": "browser",
        },
        {
          "label": "Operating System",
          "value": "os",
        },
        {
          "label": "Hostname",
          "value": "hostname",
        },
        {
          "label": "Custom Event",
          "value": "event",
        },
        {
          "label": "Goal",
          "value": "goal",
        },
        {
          "label": "Custom Event Property",
          "value": "prop",
        },
      ],
      default: "page",
    },
    propertyKey: {
      type: "string",
      label: "Property Key",
      description: "The key of the custom event property, like `plan`. Only used when **Report** is **Custom Event Property**.",
      optional: true,
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
    limit: {
      type: "integer",
      label: "Rows",
      description: "How many rows to return, from 1 to 100.",
      default: 10,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Metric to sort by, highest first. Default is the main count of the dimension: visitors for visit dimensions, pageviews for page, completions for event, goal and prop:<key>.",
      options: [
        "visitors",
        "visits",
        "pageviews",
        "revenue",
      ],
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Only rows whose value contains this text, in any letter case. It searches every value, not just the top rows. Not for goal.",
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
      path: `/sites/${utils.segment(this.siteId)}/breakdown/${utils.segment(this.dimension === "prop"
        ? `prop:${this.propertyKey}`
        : this.dimension)}.json`,
      params: utils.compact({
        period: this.period,
        from: this.period === "custom"
          ? utils.toDate(this.from)
          : undefined,
        to: this.period === "custom"
          ? utils.toDate(this.to)
          : undefined,
        limit: this.limit,
        sort: this.sort,
        search: this.search,
        filters: utils.parseJson(this.filters, "Filters"),
        segment_id: this.segmentId,
      }),
    });
    const rows = (response.rows || []).map((row, index) => ({
      rank: index + 1,
      ...row,
    }));
    $.export("$summary", `Successfully retrieved ${rows.length} row${rows.length === 1
      ? ""
      : "s"}`);
    return rows;
  },
};
