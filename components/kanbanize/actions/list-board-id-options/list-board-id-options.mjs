import kanbanize from "../../kanbanize.app.mjs";

export default {
  key: "kanbanize-list-board-id-options",
  name: "List Board Id Options",
  description: "Retrieves available options for the Board Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kanbanize,
  },
  async run({ $ }) {
    const options = await kanbanize.propDefinitions.boardId.options.call(this.kanbanize);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
