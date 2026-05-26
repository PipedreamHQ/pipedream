import richpanel from "../../richpanel.app.mjs";

export default {
  key: "richpanel-list-tags-options",
  name: "List Tags Options",
  description: "Retrieves available options for the Tags field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    richpanel,
  },
  async run({ $ }) {
    const options = await richpanel.propDefinitions.tags.options.call(this.richpanel);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
