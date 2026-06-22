import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-users",
  name: "List Users",
  description:
    "List users in the PagerDuty account, searchable by name or email."
    + " Returns user IDs, names, emails, and roles."
    + " Optionally filter by team membership using team IDs from **List Teams**."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/c96e889522dd6-list-users)",
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
      description: "Filter users by name or email substring.",
      optional: true,
    },
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "Filter to users belonging to these teams (e.g., `[\"PTEAM123\",\"PTEAM456\"]`). Use **List Teams** to discover IDs.",
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
    const response = await this.app.listUsers({
      $,
      params: {
        "query": this.query,
        "team_ids[]": this.teamIds,
        "limit": this.limit,
        "offset": this.offset,
      },
    });

    $.export("$summary", `Found ${response.users?.length ?? 0} users`);
    return response;
  },
};
