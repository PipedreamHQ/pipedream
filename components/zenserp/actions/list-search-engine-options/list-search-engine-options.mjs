import zenserp from "../../zenserp.app.mjs";

export default {
  key: "zenserp-list-search-engine-options",
  name: "List Search Engine Options",
  description: "Retrieves available options for the Search Engine field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenserp,
  },
  async run({ $ }) {
    const options = await zenserp.propDefinitions.searchEngine.options.call(this.zenserp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
