import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-priorities",
  name: "List Priorities",
  description:
    "List the priority levels configured for this PagerDuty account."
    + " Returns priority IDs and names (e.g. P1, P2, critical) useful for **Create Incident** and **Update Incident**."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/0fa9ad52bf2d2-list-priorities)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listPriorities({
      $,
    });

    $.export("$summary", `Found ${response.priorities?.length ?? 0} priorities`);
    return response;
  },
};
