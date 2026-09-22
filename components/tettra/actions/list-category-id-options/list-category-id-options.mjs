import tettra from "../../tettra.app.mjs";

export default {
  key: "tettra-list-category-id-options",
  name: "List Category ID Options",
  description: "Retrieves available options for the Category ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tettra,
  },
  async run({ $ }) {
    const options = await tettra.propDefinitions.categoryId.options.call(this.tettra);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
