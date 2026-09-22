import klaxoon from "../../klaxoon.app.mjs";

export default {
  key: "klaxoon-list-board-id-options",
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
    klaxoon,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await klaxoon.propDefinitions.boardId.options.call(this.klaxoon, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
