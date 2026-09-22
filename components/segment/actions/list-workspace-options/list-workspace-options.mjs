import segment from "../../segment.app.mjs";

export default {
  key: "segment-list-workspace-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    segment,
  },
  async run({ $ }) {
    const options = await segment.propDefinitions.workspace.options.call(this.segment);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
