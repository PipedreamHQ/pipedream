import more_trees_ from "../../more_trees_.app.mjs";

export default {
  key: "more_trees_-list-tree-type-slug-options",
  name: "List Tree Type Slug Options",
  description: "Retrieves available options for the Tree Type Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    more_trees_,
  },
  async run({ $ }) {
    const options = await more_trees_.propDefinitions.treeTypeSlug.options.call(this.more_trees_);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
