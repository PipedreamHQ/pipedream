import sproutgigs from "../../sproutgigs.app.mjs";

export default {
  key: "sproutgigs-list-category-id-options",
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
    sproutgigs,
  },
  async run({ $ }) {
    const options = await sproutgigs.propDefinitions.categoryId.options.call(this.sproutgigs);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
