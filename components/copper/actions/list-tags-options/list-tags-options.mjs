import copper from "../../copper.app.mjs";

export default {
  key: "copper-list-tags-options",
  name: "List Tags Options",
  description: "Retrieves available options for the Tags field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    copper,
  },
  async run({ $ }) {
    const options = await copper.propDefinitions.tags.options.call(this.copper);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
