import algolia from "../../algolia.app.mjs";

export default {
  key: "algolia-list-index-name-options",
  name: "List Index Name Options",
  description: "Retrieves available options for the Index Name field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    algolia,
  },
  async run({ $ }) {
    const options = await algolia.propDefinitions.indexName.options.call(this.algolia);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
