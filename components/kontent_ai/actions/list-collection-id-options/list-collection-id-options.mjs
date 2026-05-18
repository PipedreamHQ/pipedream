import kontent_ai from "../../kontent_ai.app.mjs";

export default {
  key: "kontent_ai-list-collection-id-options",
  name: "List Collection Id Options",
  description: "Retrieves available options for the Collection Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kontent_ai,
  },
  async run({ $ }) {
    const options = await kontent_ai.propDefinitions.collectionId.options.call(this.kontent_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
