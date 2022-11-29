import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Get Board",
  version: "0.0.1",
  key: "get-board",
  description: "Returns a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
    },
  },
  async run({ $: step }) {
    return this.app.getBoard({
      step,
    });
  },
};
