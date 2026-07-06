import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-schedules",
  name: "List Schedules",
  description:
    "List on-call schedules in the PagerDuty account, optionally filtered by name."
    + " Returns schedule IDs and names useful for **List On-Calls** and **Create Schedule Override**."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/846ecf84402bb-list-schedules)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Search Query",
      description: "Filter schedules by name substring.",
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
    const response = await this.app.listSchedules({
      $,
      params: {
        query: this.query,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.schedules?.length ?? 0} schedules`);
    return response;
  },
};
