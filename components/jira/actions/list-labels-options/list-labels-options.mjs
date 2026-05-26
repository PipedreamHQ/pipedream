import jira from "../../jira.app.mjs";

export default {
  key: "jira-list-labels-options",
  name: "List Labels Options",
  description: "Retrieves available options for the Labels field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira,
  },
  async run({ $ }) {
    const options = await jira.propDefinitions.labels.options.call(this.jira);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
