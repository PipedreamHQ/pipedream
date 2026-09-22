import x_ai from "../../x_ai.app.mjs";

export default {
  key: "x_ai-list-embedding-model-options",
  name: "List Embedding Models Options",
  description: "Retrieves available options for the Embedding Models field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    x_ai,
  },
  async run({ $ }) {
    const options = await x_ai.propDefinitions.embeddingModel.options.call(this.x_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
