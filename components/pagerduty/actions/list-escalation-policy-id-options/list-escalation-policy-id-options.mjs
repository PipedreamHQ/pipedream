import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-escalation-policy-id-options",
  name: "List Escalation Policy ID Options",
  description: "Retrieves available options for the Escalation Policy ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pagerduty,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pagerduty.propDefinitions.escalationPolicyId.options
      .call(this.pagerduty, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
