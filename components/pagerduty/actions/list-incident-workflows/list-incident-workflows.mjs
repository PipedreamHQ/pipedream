import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-incident-workflows",
  name: "List Incident Workflows",
  description:
    "List available incident automation workflows."
    + " Use workflow IDs with **Start Incident Workflow** to run automation on an active incident."
    + " Requires Business+ plan — accounts without this plan will receive empty results or a 402 error."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/d54514b5b003f-list-incident-workflows)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
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
    const response = await this.app.listIncidentWorkflows({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });

    $.export("$summary", `Found ${response.incident_workflows?.length ?? 0} incident workflows`);
    return response;
  },
};
