import specific from "../../specific.app.mjs";

export default {
  key: "specific-list-source-id-options",
  name: "List Source Id Options",
  description: "Retrieves available options for the Source Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    specific,
  },
  async run({ $ }) {
    const options = await specific.propDefinitions.sourceId.options.call(this.specific);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
