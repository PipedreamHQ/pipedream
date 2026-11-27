import app from "../../simple_analytics.app.mjs";
import {
  STATS_FIELDS, DEFAULT_STATS_FIELDS, HISTOGRAM_INTERVALS,
} from "../../common/constants.mjs";

export default {
  key: "simple_analytics-get-stats",
  name: "Get Stats",
  description: "Gets traffic stats for one Simple Analytics website and date range: pageviews, visitors, top pages, countries, referrers, UTM values, browsers, devices, or a histogram over time."
    + " Use it for questions about how a site performs. Use **List Websites** first when you don't know the hostname."
    + " Not for listing sites (use **List Websites**); it cannot add or edit sites."
    + " Returns only the requested fields, by default: " + DEFAULT_STATS_FIELDS.join(", ") + ". Pass just the fields you need to keep the response small."
    + " Breakdown lists are capped by `limit` (default 50). A failure raises an error with the API's message; HTTP 429 means wait the `Retry-After` seconds, and HTTP 423 means the site is locked on the Free plan."
    + " Example: hostname=`example.com`, start=`2026-11-01`, end=`2026-11-07`, fields=[`pageviews`, `countries`] → total pageviews and the top countries for that week."
    + " [See the documentation](https://docs.simpleanalytics.com/api/stats)",
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
    hostname: {
      propDefinition: [
        app,
        "hostname",
      ],
    },
    start: {
      type: "string",
      label: "Start",
      description: "First day to include, as `YYYY-MM-DD`, e.g. `2026-11-01`. Defaults to 30 days ago.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "Last day to include, as `YYYY-MM-DD`, e.g. `2026-11-07`. Defaults to today.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Which stats to return, e.g. `pageviews`, `countries`. Defaults to " + DEFAULT_STATS_FIELDS.join(", ") + ". `histogram` returns values per `interval`.",
      options: STATS_FIELDS,
      optional: true,
    },
    interval: {
      type: "string",
      label: "Interval",
      description: "Bucket size for the `histogram` field, e.g. `day`. Ignored unless `histogram` is in Fields.",
      options: HISTOGRAM_INTERVALS,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum rows per breakdown list such as `pages` or `countries`, 1 to 1000, e.g. `10`. Defaults to 50.",
      min: 1,
      max: 1000,
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "IANA timezone used for day boundaries, e.g. `Europe/Amsterdam`. Defaults to the site's timezone.",
      optional: true,
    },
    page: {
      type: "string",
      label: "Page Filter",
      description: "Only count visits to this page path, e.g. `/pricing`.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country Filter",
      description: "Only count visitors from this two-letter country code, e.g. `NL`.",
      optional: true,
    },
    referrer: {
      type: "string",
      label: "Referrer Filter",
      description: "Only count visits referred from this hostname, e.g. `news.ycombinator.com`.",
      optional: true,
    },
    deviceType: {
      type: "string",
      label: "Device Type Filter",
      description: "Only count visits from this device type, e.g. `mobile`.",
      options: [
        "mobile",
        "tablet",
        "desktop",
        "tv",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_STATS_FIELDS;
    const response = await this.app.getStats({
      $,
      hostname: this.hostname,
      params: {
        version: 6,
        fields: fields.join(","),
        start: this.start,
        end: this.end,
        interval: this.interval,
        limit: this.limit,
        timezone: this.timezone,
        page: this.page,
        country: this.country,
        referrer: this.referrer,
        device_type: this.deviceType,
      },
    });
    $.export("$summary", `Fetched ${fields.join(", ")} for ${this.hostname}`);
    return response;
  },
};
