import zoho_projects from "../../zoho_projects.app.mjs";

export default {
  key: "zoho_projects-list-portal-id-options",
  name: "List Portal ID Options",
  description: "Retrieves available options for the Portal ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_projects,
  },
  async run({ $ }) {
    const options = await zoho_projects.propDefinitions.portalId.options.call(this.zoho_projects);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
