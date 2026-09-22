import nextdoor from "../../nextdoor.app.mjs";

export default {
  key: "nextdoor-list-category-id-options",
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
    nextdoor,
  },
  async run({ $ }) {
    const options = await nextdoor.propDefinitions.categoryId.options.call(this.nextdoor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
