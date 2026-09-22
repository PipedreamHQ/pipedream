import rex from "../../rex.app.mjs";

export default {
  key: "rex-list-source-id-options",
  name: "List Source Options",
  description: "Retrieves available options for the Source field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rex,
  },
  async run({ $ }) {
    const options = await rex.propDefinitions.sourceId.options.call(this.rex);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
