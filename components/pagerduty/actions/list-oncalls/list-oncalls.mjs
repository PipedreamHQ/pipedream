import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-oncalls",
  name: "List On-Calls",
  description:
    "List on-call entries — who is on call right now or during a given time window."
    + " Filterable by schedule IDs or escalation policy IDs."
    + " Use **List Schedules** to discover schedule IDs and **List Escalation Policies** to discover policy IDs."
    + " Time params use ISO 8601 with explicit UTC offset, e.g. `2026-06-02T15:00:00-07:00`."
    + " Set `earliest: true` to get one on-call entry per unique (schedule, escalation policy, escalation level) combination."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/3a6b910f11050-list-all-of-the-on-calls)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    scheduleIds: {
      type: "string[]",
      label: "Schedule IDs",
      description: "Filter results to on-calls for these schedule IDs. Use **List Schedules** to discover IDs.",
      optional: true,
    },
    escalationPolicyIds: {
      type: "string[]",
      label: "Escalation Policy IDs",
      description: "Filter results to on-calls for these escalation policy IDs.",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Start of time range (ISO 8601 with UTC offset, e.g. `2026-06-02T15:00:00-07:00`). Defaults to now.",
      optional: true,
    },
    until: {
      type: "string",
      label: "Until",
      description: "End of time range (ISO 8601 with UTC offset). Defaults to now. Search range cannot exceed 3 months.",
      optional: true,
    },
    earliest: {
      type: "boolean",
      label: "Earliest Only",
      description: "When `true`, returns only the earliest on-call per unique (schedule, escalation policy, level) combination.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return (1–100). Default: 25.",
      optional: true,
      default: 25,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Pagination offset. Default: 0.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const response = await this.app.listOncalls({
      $,
      params: {
        "schedule_ids[]": this.scheduleIds,
        "escalation_policy_ids[]": this.escalationPolicyIds,
        "since": this.since,
        "until": this.until,
        "earliest": this.earliest,
        "limit": this.limit,
        "offset": this.offset,
      },
    });

    $.export("$summary", `Found ${response.oncalls?.length ?? 0} on-call entries`);
    return response;
  },
};
