import kanban_tool from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-list-board-id-options",
  name: "List Board ID Options",
  description: "Retrieves available options for the Board ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kanban_tool,
  },
  async run({ $ }) {
    const options = await kanban_tool.propDefinitions.boardId.options.call(this.kanban_tool);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
