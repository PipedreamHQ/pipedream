import attractwell from "../../attractwell.app.mjs";

export default {
  key: "attractwell-list-tag-options",
  name: "List Tag Options",
  description: "Retrieves available options for the Tag field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    attractwell,
  },
  async run({ $ }) {
    const options = await attractwell.propDefinitions.tag.options.call(this.attractwell);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
