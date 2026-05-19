import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-workspace-id-options",
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
    clockify,
  },
  async run({ $ }) {
    const options = await clockify.propDefinitions.workspaceId.options.call(this.clockify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
