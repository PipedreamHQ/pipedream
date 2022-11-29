import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Update Board",
  version: "0.0.1",
  key: "update-board",
  description: "Updates a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
    },
    boardName: {
      type: "string",
      description: "Board Name",
      optional: true,
    },
    boardDescription: {
      type: "string",
      description: "Board Description",
      optional: true,
    },
  },
  async run({ $: step }) {
    return this.app.updateBoard({
      step,
      data: {
        boardName: this.boardName,
        boardDescription: this.boardDescription,
      },
    });
  },
};
