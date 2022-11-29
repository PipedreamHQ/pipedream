import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Get Items",
  version: "0.0.1",
  key: "get-items",
  description: "Returns items on a Miro board",
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
    return this.app.getItems({
      step,
    });
  },
};
