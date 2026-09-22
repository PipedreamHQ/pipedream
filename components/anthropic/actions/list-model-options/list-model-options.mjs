import anthropic from "../../anthropic.app.mjs";

export default {
  key: "anthropic-list-model-options",
  name: "List Model Options",
  description: "Retrieves available options for the Model field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    anthropic,
  },
  async run({ $ }) {
    const options = await anthropic.propDefinitions.model.options.call(this.anthropic);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
