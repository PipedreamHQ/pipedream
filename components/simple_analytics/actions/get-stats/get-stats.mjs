import app from "../../simple_analytics.app.mjs";

const STATS_API_VERSION = 6;
const DEFAULT_FIELDS = [
  "pageviews",
  "visitors",
];

export default {
  key: "simple_analytics-get-stats",
  name: "Get Stats",
  description: "Get aggregated statistics for one website over a date range, such as page views, visitors, top pages and referrers."
    + " Use **List Websites** to find the website."
    + " [See the documentation](https://docs.simpleanalytics.com/api/stats)",
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
    hostname: {
      propDefinition: [
        app,
        "hostname",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The data to return, e.g. `[\"pageviews\", \"visitors\", \"pages\"]`. Defaults to `pageviews` and `visitors`.",
      options: [
        "pageviews",
        "visitors",
        "histogram",
        "pages",
        "countries",
        "referrers",
        "utm_sources",
        "utm_mediums",
        "utm_campaigns",
        "utm_contents",
        "utm_terms",
        "browser_names",
        "os_names",
        "device_types",
        "seconds_on_page",
      ],
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "The start date as `YYYY-MM-DD`, e.g. `2026-10-01`. Defaults to one month ago.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "The end date as `YYYY-MM-DD`, e.g. `2026-10-31`. Defaults to today.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "A time zone with capitals, e.g. `Europe/Amsterdam`.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Only count these pages, as a comma-separated list, e.g. `/contact,/product/*`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The most rows to return for list fields such as `pages`, from `1` to `1000`, e.g. `100`. Defaults to `50`.",
      min: 1,
      max: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const stats = await this.app.getStats({
      $,
      hostname: this.hostname,
      params: {
        version: STATS_API_VERSION,
        info: false,
        fields: (this.fields ?? DEFAULT_FIELDS).join(","),
        start: this.start,
        end: this.end,
        timezone: this.timezone,
        pages: this.pages,
        limit: this.limit,
      },
    });
    $.export("$summary", `Retrieved stats for ${this.hostname}`);
    return stats;
  },
};
