import canny from "../../canny.app.mjs";

export default {
  key: "canny-list-board-id-options",
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
    canny,
  },
  async run({ $ }) {
    const options = await canny.propDefinitions.boardId.options.call(this.canny);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
