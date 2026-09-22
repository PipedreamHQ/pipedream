import one_ai from "../../one_ai.app.mjs";

export default {
  key: "one_ai-list-collection-options",
  name: "List Collection Options",
  description: "Retrieves available options for the Collection field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    one_ai,
  },
  async run({ $ }) {
    const options = await one_ai.propDefinitions.collection.options.call(this.one_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
