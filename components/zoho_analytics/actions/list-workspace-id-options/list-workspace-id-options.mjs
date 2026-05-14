import zoho_analytics from "../../zoho_analytics.app.mjs";

export default {
  key: "zoho_analytics-list-workspace-id-options",
  name: "List Workspace Id Options",
  description: "Retrieves available options for the Workspace Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_analytics,
  },
  async run({ $ }) {
    const options = await zoho_analytics.propDefinitions.workspaceId.options
      .call(this.zoho_analytics);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
