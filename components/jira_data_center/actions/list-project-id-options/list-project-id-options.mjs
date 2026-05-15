import jira_data_center from "../../jira_data_center.app.mjs";

export default {
  key: "jira_data_center-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira_data_center,
  },
  async run({ $ }) {
    const options = await jira_data_center.propDefinitions.projectId.options
      .call(this.jira_data_center);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
