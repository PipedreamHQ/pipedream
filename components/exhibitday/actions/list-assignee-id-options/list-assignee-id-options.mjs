import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-list-assignee-id-options",
  name: "List Assignee ID Options",
  description: "Retrieves available options for the Assignee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    exhibitday,
  },
  async run({ $ }) {
    const options = await exhibitday.propDefinitions.assigneeId.options.call(this.exhibitday);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
