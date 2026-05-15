import blink from "../../blink.app.mjs";

export default {
  key: "blink-list-category-id-options",
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
    blink,
  },
  async run({ $ }) {
    const options = await blink.propDefinitions.categoryId.options.call(this.blink);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
