import jiraDataCenter from "../../jira_data_center.app.mjs";

export default {
  key: "jira_data_center-list-filter-id-options",
  name: "List Filter ID Options",
  description: "Retrieves available options for the Filter ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jiraDataCenter,
  },
  async run({ $ }) {
    const options = await jiraDataCenter.propDefinitions.filterId.options
      .call(this.jiraDataCenter);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
