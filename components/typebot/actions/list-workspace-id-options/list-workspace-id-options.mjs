import typebot from "../../typebot.app.mjs";

export default {
  key: "typebot-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "Retrieves available options for the Workspace ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    typebot,
  },
  async run({ $ }) {
    const options = await typebot.propDefinitions.workspaceId.options.call(this.typebot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
