import espy from "../../espy.app.mjs";

export default {
  key: "espy-list-search-id-options",
  name: "List Search ID Options",
  description: "Retrieves available options for the Search ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    espy,
  },
  async run({ $ }) {
    const options = await espy.propDefinitions.searchId.options.call(this.espy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
