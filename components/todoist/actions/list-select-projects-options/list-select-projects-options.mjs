import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-list-select-projects-options",
  name: "List Select Projects Options",
  description: "Retrieves available options for the Select Projects field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    todoist,
  },
  async run({ $ }) {
    const options = await todoist.propDefinitions.selectProjects.options.call(this.todoist);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
