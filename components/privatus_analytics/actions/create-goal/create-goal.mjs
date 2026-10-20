import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-create-goal",
  name: "Create Goal",
  description: "Creates a conversion goal on a site. Goals count matching events across all existing history at once. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": false,
    "readOnlyHint": false,
  },
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Goal name, up to 120 characters, for example Signed up.",
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "page (visit a page), event (custom event), engagement (scroll or time on page), outbound (outbound link click) or download (file download).",
      options: [
        "page",
        "event",
        "engagement",
        "outbound",
        "download",
      ],
      default: "page",
    },
    matchType: {
      type: "string",
      label: "Match Type",
      description: "How pattern matches the path (page, engagement), link domain (outbound) or file (download): exact, prefix, glob (*) or regex.",
      options: [
        "exact",
        "prefix",
        "glob",
        "regex",
      ],
      default: "exact",
      optional: true,
    },
    pattern: {
      type: "string",
      label: "Pattern",
      description: "Required for page, engagement, outbound and download goals. A path for page and engagement (/pricing, /blog/*), a link domain for outbound (stripe.com) or a file name for download (*.pdf). Read according to match_type.",
      optional: true,
    },
    hostname: {
      type: "string",
      label: "Hostname",
      description: "Page goals only. Count the page only on this hostname, for example docs.example.com. Leave empty for any hostname.",
      optional: true,
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Required for event goals. The custom event name, for example Signup.",
      optional: true,
    },
    conditions: {
      type: "string",
      label: "Conditions",
      description: "Event goals only. A JSON list of property tests that must all match, like `[{\"key\":\"plan\",\"operator\":\"is\",\"value\":\"pro\"}]`. Operators: `is`, `is_not`, `contains`, `gt`, `lt`.",
      optional: true,
    },
    scrollThreshold: {
      type: "integer",
      label: "Scroll Threshold",
      description: "Engagement goals only. Percent of the page scrolled, 1 to 100. The goal is met when this OR time_threshold_seconds is reached.",
      optional: true,
    },
    timeThresholdSeconds: {
      type: "integer",
      label: "Time Threshold Seconds",
      description: "Engagement goals only. Seconds of engaged time on the page. The goal is met when this OR scroll_threshold is reached.",
      optional: true,
    },
    valueMode: {
      type: "string",
      label: "Value Mode",
      description: "none, fixed (fixed_value per conversion) or revenue (the event revenue).",
      options: [
        "none",
        "fixed",
        "revenue",
      ],
      default: "none",
      optional: true,
    },
    fixedValue: {
      type: "string",
      label: "Fixed Value",
      description: "The value of one completion in the site currency, like `49.5`. Used when **Value Mode** is `fixed`.",
      optional: true,
    },
    countMode: {
      type: "string",
      label: "Count Mode",
      description: "Value counts once_per_visit or every completion.",
      options: [
        "once_per_visit",
        "every",
      ],
      default: "once_per_visit",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/sites/${utils.segment(this.siteId)}/goals.json`,
      data: utils.compact({
        name: this.name,
        kind: this.kind,
        match_type: this.matchType,
        pattern: this.pattern,
        hostname: this.hostname,
        event_name: this.eventName,
        conditions: utils.parseJson(this.conditions, "Conditions"),
        scroll_threshold: this.scrollThreshold,
        time_threshold_seconds: this.timeThresholdSeconds,
        value_mode: this.valueMode,
        fixed_value: utils.toNumber(this.fixedValue),
        count_mode: this.countMode,
      }),
    });
    $.export("$summary", `Successfully created goal '${response.name}'`);
    return response;
  },
};
