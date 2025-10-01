import common from "../common/base.mjs";

export default {
  ...common,
  name: "Delete Board",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "miro_custom_app-delete-board",
  description: "Deletes a Miro board. [See the docs](https://developers.miro.com/reference/delete-board).",
  type: "action",
  async run({ $: step }) {
    const { boardId } = this;

    await this.app.deleteBoard({
      step,
      boardId: this.boardId,
    });

    step.export("$summary", "Successfully deleted board");

    return boardId;
  },
};
