import timing from "../../timing.app.mjs";

export default {
  key: "timing-list-project-options",
  name: "List Project Options",
  description: "Retrieves available options for the Project field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    timing,
  },
  async run({ $ }) {
    const options = await timing.propDefinitions.project.options.call(this.timing);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
