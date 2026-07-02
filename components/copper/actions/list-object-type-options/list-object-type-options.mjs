import copper from "../../copper.app.mjs";

export default {
  key: "copper-list-object-type-options",
  name: "List Object Type Options",
  description: "Retrieves available options for the Object Type field.",
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
    const options = await copper.propDefinitions.objectType.options.call(this.copper);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
