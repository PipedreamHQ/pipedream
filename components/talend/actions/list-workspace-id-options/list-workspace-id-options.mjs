import talend from "../../talend.app.mjs";

export default {
  key: "talend-list-workspace-id-options",
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
    talend,
  },
  async run({ $ }) {
    const options = await talend.propDefinitions.workspaceId.options.call(this.talend);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
