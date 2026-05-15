import epsy from "../../epsy.app.mjs";

export default {
  key: "epsy-list-search-id-options",
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
    epsy,
  },
  async run({ $ }) {
    const options = await epsy.propDefinitions.searchId.options.call(this.epsy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
