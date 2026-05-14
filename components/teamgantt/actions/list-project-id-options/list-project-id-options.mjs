import teamgantt from "../../teamgantt.app.mjs";

export default {
  key: "teamgantt-list-project-id-options",
  name: "List Project Id Options",
  description: "Retrieves available options for the Project Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teamgantt,
  },
  async run({ $ }) {
    const options = await teamgantt.propDefinitions.projectId.options.call(this.teamgantt);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
