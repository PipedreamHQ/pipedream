import zoho_sprints from "../../zoho_sprints.app.mjs";

export default {
  key: "zoho_sprints-list-team-id-options",
  name: "List Team Options",
  description: "Retrieves available options for the Team field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_sprints,
  },
  async run({ $ }) {
    const options = await zoho_sprints.propDefinitions.teamId.options.call(this.zoho_sprints);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
