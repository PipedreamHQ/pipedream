import topdesk from "../../topdesk.app.mjs";

export default {
  key: "topdesk-list-category-id-options",
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
    topdesk,
  },
  async run({ $ }) {
    const options = await topdesk.propDefinitions.categoryId.options.call(this.topdesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
