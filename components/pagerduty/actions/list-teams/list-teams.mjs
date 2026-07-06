import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-teams",
  name: "List Teams",
  description:
    "List teams in the PagerDuty account, optionally filtered by name."
    + " Returns team IDs and names useful for filtering incidents, users, and services."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODIyMw-list-teams)",
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
      description: "Filter teams by name substring.",
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
    const response = await this.app.listTeams({
      $,
      params: {
        query: this.query,
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.teams?.length ?? 0} teams`);
    return response;
  },
};
