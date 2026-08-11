// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import {
  FUNNEL_MODES,
  NEW_OR_ACTIVE,
  INTERVAL_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "amplitude-get-funnel-analysis",
  name: "Get Funnel Analysis",
  description: "Compute conversion rates across an ordered (or unordered/sequential) set of funnel steps over a date range from the Amplitude Dashboard REST API. Provide one event definition per funnel step. Example: call with `events=[\"{\\\"event_type\\\":\\\"Sign Up\\\"}\",\"{\\\"event_type\\\":\\\"Purchase\\\"}\"]`, `startDate=\"20240706\"`, `endDate=\"20240805\"` -> returns `{data: [{stepByStep: [...], cumulative: [...], eventCount: 4200}, ...]}` (one entry per step). [See the documentation](https://amplitude.com/docs/apis/analytics/dashboard-rest#funnel-analysis).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    events: {
      type: "string[]",
      label: "Events",
      description: "Array of JSON-encoded event definitions, one per funnel step, in order (each becomes a repeated `e` param). Example: `[\"{\\\"event_type\\\":\\\"Sign Up\\\"}\",\"{\\\"event_type\\\":\\\"Purchase\\\"}\"]`.",
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
    mode: {
      type: "string",
      label: "Mode",
      description: "Funnel step ordering (the `mode` param). One of `ordered`, `unordered`, `sequential`. Defaults to `ordered`.",
      options: FUNNEL_MODES,
      optional: true,
    },
    newOrActive: {
      type: "string",
      label: "New or Active",
      description: "Restrict to `new` or `active` users (the `n` param).",
      options: NEW_OR_ACTIVE,
      optional: true,
    },
    interval: {
      type: "integer",
      label: "Interval",
      description: "Time interval (the `i` param). One of `-300000` (realtime), `-3600000` (hourly), `1` (daily), `7` (weekly), `30` (monthly).",
      options: INTERVAL_OPTIONS,
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
      description: "A single property name to group results by (the `g` param). Funnels support at most one group-by.",
      optional: true,
    },
    conversionWindowSeconds: {
      type: "integer",
      label: "Conversion Window (seconds)",
      description: "Conversion window in seconds (the `cs` param). Defaults to 2592000 (30 days).",
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
    const params = new URLSearchParams();
    for (const event of this.events) {
      params.append("e", event);
    }
    params.append("start", this.startDate);
    params.append("end", this.endDate);
    if (this.mode) {
      params.append("mode", this.mode);
    }
    if (this.newOrActive) {
      params.append("n", this.newOrActive);
    }
    if (this.interval !== undefined && this.interval !== null) {
      params.append("i", String(this.interval));
    }
    if (this.segmentDefinitions) {
      params.append("s", this.segmentDefinitions);
    }
    if (this.groupBy) {
      params.append("g", this.groupBy);
    }
    if (this.conversionWindowSeconds !== undefined && this.conversionWindowSeconds !== null) {
      params.append("cs", String(this.conversionWindowSeconds));
    }
    if (this.limit !== undefined && this.limit !== null) {
      params.append("limit", String(this.limit));
    }

    const response = await this.app.getFunnelAnalysis({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved funnel analysis from ${this.startDate} to ${this.endDate}`);
    return response;
  },
};
