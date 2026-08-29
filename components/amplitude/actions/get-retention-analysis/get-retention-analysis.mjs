// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../amplitude.app.mjs";
import { RETENTION_MODES } from "../../common/constants.mjs";

export default {
  key: "amplitude-get-retention-analysis",
  name: "Get Retention Analysis",
  description: "Compute retention (return rate) between a start event and a return event over a date range from the Amplitude Dashboard REST API. Example: call with `startEvent={\"event_type\":\"_new\"}`, `returnEvent={\"event_type\":\"_active\"}`, `startDate=\"20240706\"`, `endDate=\"20240805\"` -> returns `{data: {series: [[...retention counts per interval...]], seriesLabels: [...]}}`. [See the documentation](https://amplitude.com/docs/apis/analytics/dashboard-rest#retention-analysis).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    startEvent: {
      type: "string",
      label: "Start Event",
      description: "JSON-encoded start event definition (the `se` param). Use a real event name, or Amplitude's built-in `_new` (new user) event. Example: `{\"event_type\":\"_new\"}`. Do NOT use the literal string \"Any Active Event\" — that's Amplitude UI label text, not a valid `event_type` value, and returns a 400.",
    },
    returnEvent: {
      type: "string",
      label: "Return Event",
      description: "JSON-encoded return event definition (the `re` param). Use a real event name, or Amplitude's built-in `_active` (active user) event. Example: `{\"event_type\":\"_active\"}`. Do NOT use the literal string \"Any Active Event\" — that's Amplitude UI label text, not a valid `event_type` value, and returns a 400.",
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    retentionMode: {
      type: "string",
      label: "Retention Mode",
      description: "Retention calculation mode (the `rm` param). One of `bracket`, `rolling`, `nday`. Defaults to `nday`. (Amplitude's own docs say `n-day` with a hyphen — that value is rejected by the live API with a 400; the working value is `nday`, no hyphen, confirmed directly against the API.) `rolling` returns an unbounded, much larger response — prefer `nday` unless you specifically need rolling retention, and if using `rolling` over a long date range, raise `interval` (e.g. to `7` or `30`) to keep the response size manageable.",
      options: RETENTION_MODES,
      optional: true,
    },
    brackets: {
      type: "string",
      label: "Brackets",
      description: "Bracket day-ranges as a JSON-encoded array of `[start, end]` integer pairs, required only when Retention Mode is `bracket` (the `rb` param). Each pair is a day offset range (`start` must be ≤ `end`; Amplitude returns a 500 for a reversed range). Example: `[[0,4]]` for a single 0-4 day bracket, or `[[0,4],[5,9]]` for two brackets.",
      optional: true,
    },
    interval: {
      type: "integer",
      label: "Interval",
      description: "Time interval (the `i` param). One of `1` (daily), `7` (weekly), `30` (monthly). Defaults to `1` (daily), but daily granularity over a date range wider than ~2 weeks produces a very large response (one retention curve per day in range) that can exceed the MCP output limit. For any date range longer than 2 weeks, pass `7` (weekly) or `30` (monthly) instead of relying on the default.",
      options: [
        {
          label: "Daily",
          value: 1,
        },
        {
          label: "Weekly",
          value: 7,
        },
        {
          label: "Monthly",
          value: 30,
        },
      ],
      optional: true,
    },
    segmentDefinitions: {
      propDefinition: [
        app,
        "segmentDefinitions",
      ],
    },
    groupBy: {
      type: "string",
      label: "Group By",
      description: "A single property name to group results by (the `g` param). Retention supports at most one group-by.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    if (this.retentionMode === "bracket") {
      if (!this.brackets) {
        throw new ConfigurationError("**Brackets** is required when Retention Mode is `bracket`. Example: `[[0,5]]`.");
      }
      let parsedBrackets;
      try {
        parsedBrackets = JSON.parse(this.brackets);
      } catch {
        throw new ConfigurationError("**Brackets** must be valid JSON, e.g. `[[0,4]]`.");
      }
      if (!Array.isArray(parsedBrackets) || parsedBrackets.length === 0) {
        throw new ConfigurationError("**Brackets** must be a non-empty JSON-encoded array of `[start, end]` pairs, e.g. `[[0,4]]`.");
      }
      for (const range of parsedBrackets) {
        const isValidPair = Array.isArray(range) && range.length === 2
          && Number.isInteger(range[0]) && Number.isInteger(range[1]);
        if (!isValidPair) {
          throw new ConfigurationError(`**Brackets** entry ${JSON.stringify(range)} must be a two-integer \`[start, end]\` pair, e.g. \`[0,4]\`.`);
        }
        if (range[0] > range[1]) {
          throw new ConfigurationError(`**Brackets** entry ${JSON.stringify(range)} has \`start\` greater than \`end\` — Amplitude returns a 500 for a reversed range, not a clean error.`);
        }
      }
    }
    const response = await this.app.getRetentionAnalysis({
      $,
      params: {
        se: this.startEvent,
        re: this.returnEvent,
        start: this.startDate,
        end: this.endDate,
        rm: this.retentionMode,
        rb: this.brackets,
        i: this.interval,
        s: this.segmentDefinitions,
        g: this.groupBy,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved retention analysis from ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
