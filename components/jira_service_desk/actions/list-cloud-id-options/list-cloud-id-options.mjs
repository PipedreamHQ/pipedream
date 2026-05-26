import jira_service_desk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-cloud-id-options",
  name: "List Cloud ID Options",
  description: "Retrieves available options for the Cloud ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira_service_desk,
  },
  async run({ $ }) {
    const options = await jira_service_desk.propDefinitions.cloudId.options
      .call(this.jira_service_desk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
