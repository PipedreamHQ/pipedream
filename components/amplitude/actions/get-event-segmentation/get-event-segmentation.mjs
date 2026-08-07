// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import {
  SEGMENTATION_METRICS,
  INTERVAL_OPTIONS,
  LIMIT_MIN,
  LIMIT_MAX,
} from "../../common/constants.mjs";

export default {
  key: "amplitude-get-event-segmentation",
  name: "Get Event Segmentation",
  description: "Query event segmentation data (counts, uniques, and other metrics) for one or more events over a date range from the Amplitude Dashboard REST API. Use this to analyze how an event trends over time, optionally broken down by user properties. Example: call with `event={\"event_type\":\"Purchase\"}`, `startDate=\"20240706\"`, `endDate=\"20240805\"`, `metric=\"uniques\"` -> returns `{data: {xValues: [\"2024-07-06\", ...], series: [[42, 51, ...]]}}` (one value per day per requested series). [See the documentation](https://amplitude.com/docs/apis/analytics/dashboard-rest#event-segmentation).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    event: {
      type: "string",
      label: "Event",
      description: "A single JSON-encoded event definition (the `e` param). `event_type` is required; `filters` and `group_by` are optional. Use a real event name from your project (e.g. `Purchase`, `Sign Up`), or Amplitude's built-in `_active`/`_new` events to query overall activity. Example: `{\"event_type\":\"_active\"}` (Amplitude's built-in \"any active event\" — do NOT use the literal string \"Any Active Event\", which is Amplitude UI label text, not a valid `event_type` value, and returns a 400).",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date, inclusive, in `YYYYMMDD` format (the `start` param). Example: `20240706`.",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date, inclusive, in `YYYYMMDD` format (the `end` param). Example: `20240805`.",
    },
    metric: {
      type: "string",
      label: "Metric",
      description: "Metric to compute (the `m` param). One of: `uniques`, `totals`, `pct_dau`, `average`, `histogram`, `sums`, `value_avg`, `formula`. Defaults to `uniques`.",
      options: SEGMENTATION_METRICS,
      optional: true,
    },
    interval: {
      type: "integer",
      label: "Interval",
      description: "Time interval (the `i` param). One of `-300000` (realtime), `-3600000` (hourly), `1` (daily), `7` (weekly), `30` (monthly). Defaults to `1`.",
      options: INTERVAL_OPTIONS,
      optional: true,
    },
    segmentDefinitions: {
      type: "string",
      label: "Segment Definitions",
      description: "JSON-encoded array of segment definitions (the `s` param). Example: `[{\"prop\":\"country\",\"op\":\"is\",\"values\":[\"US\"]}]`.",
      optional: true,
    },
    groupBy: {
      type: "string",
      label: "Group By",
      description: "A user or event property name to group results by (the `g` param).",
      optional: true,
    },
    groupBy2: {
      type: "string",
      label: "Group By 2",
      description: "A second property name to group results by (the `g2` param). Only used together with Group By.",
      optional: true,
    },
    secondEvent: {
      type: "string",
      label: "Second Event",
      description: "A second JSON-encoded event definition (the `e2` param) for a derived/comparison metric. Example: `{\"event_type\":\"Purchase\"}`.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of grouped values to return (the \`limit\` param). Min ${LIMIT_MIN}, max ${LIMIT_MAX}. Defaults to 100. Amplitude has no cursor for this endpoint — values beyond this cap are silently dropped by the API, not just this tool. If more than \`limit\` distinct group-by values may exist, raise this toward ${LIMIT_MAX} or narrow with Segment Definitions/Group By.`,
      min: LIMIT_MIN,
      max: LIMIT_MAX,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getEventSegmentation({
      $,
      params: {
        e: this.event,
        start: this.startDate,
        end: this.endDate,
        m: this.metric,
        i: this.interval,
        s: this.segmentDefinitions,
        g: this.groupBy,
        g2: this.groupBy2,
        e2: this.secondEvent,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved event segmentation data from ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
