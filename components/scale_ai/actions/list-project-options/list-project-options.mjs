import scale_ai from "../../scale_ai.app.mjs";

export default {
  key: "scale_ai-list-project-options",
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
    scale_ai,
  },
  async run({ $ }) {
    const options = await scale_ai.propDefinitions.project.options.call(this.scale_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
