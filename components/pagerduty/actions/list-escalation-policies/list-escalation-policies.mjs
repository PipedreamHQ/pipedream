import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-escalation-policies",
  name: "List Escalation Policies",
  description:
    "List escalation policies in the PagerDuty account."
    + " Supports both exact name match (`name`) and substring search (`query`), plus team filtering."
    + " Use policy IDs with **Create Incident**, **Create Service**, and **Update Escalation Policy**."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/51b21014a4f5a-list-escalation-policies)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name (Exact)",
      description: "Filter to the policy with exactly this name.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Filter policies by name substring.",
      optional: true,
    },
    teamIds: {
      type: "string[]",
      label: "Team IDs",
      description: "Filter to policies belonging to these teams.",
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
    const response = await this.app.listEscalationPolicies({
      $,
      params: {
        "name": this.name,
        "query": this.query,
        "team_ids[]": this.teamIds,
        "limit": this.limit,
        "offset": this.offset,
      },
    });

    $.export("$summary", `Found ${response.escalation_policies?.length ?? 0} escalation policies`);
    return response;
  },
};
