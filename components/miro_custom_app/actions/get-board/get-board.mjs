import common from "../common/base.mjs";

export default {
  ...common,
  name: "Get Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "miro_custom_app-get-board",
  description: "Returns a Miro board. [See the docs](https://developers.miro.com/reference/get-specific-board).",
  type: "action",
  async run({ $: step }) {
    const response = await this.app.getBoard({
      step,
      boardId: this.boardId,
    });

    step.export("$summary", `Successfully got board with ID \`${response.id}\``);

    return response;
  },
};
