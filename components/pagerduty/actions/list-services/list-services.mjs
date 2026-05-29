import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-services",
  name: "List Services",
  description:
    "List services, optionally filtered by team or searched by name."
    + " Returns service IDs, names, status, and `html_url`."
    + " Use **List Teams** to discover team IDs for filtering."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/e960cca205c0f-list-services)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "Filter to services belonging to these teams. Use **List Teams** to discover IDs.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Filter services by name substring.",
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Additional detail to include. Options: `escalation_policies`, `teams`.",
      options: [
        "escalation_policies",
        "teams",
      ],
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
    const response = await this.app.listServices({
      $,
      params: {
        "team_ids[]": this.teamIds,
        "include[]": this.include,
        "query": this.query,
        "limit": this.limit,
        "offset": this.offset,
      },
    });

    $.export("$summary", `Found ${response.services?.length ?? 0} services`);
    return response;
  },
};
