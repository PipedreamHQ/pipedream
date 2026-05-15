import typefully from "../../typefully.app.mjs";

export default {
  key: "typefully-list-content-filter-options",
  name: "List Content Filter Options",
  description: "Retrieves available options for the Content Filter field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typefully,
  },
  async run({ $ }) {
    const options = await typefully.propDefinitions.contentFilter.options.call(this.typefully);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
