import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Get Specific Item",
  version: "0.0.2",
  key: "get-specific-item",
  description: "Returns a specific item on a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
    },
    itemId: {
      type: "string",
      description: "Item ID",
      optional: false,
    },
  },
  async run({ $: step }) {
    return this.app.getSpecificItem({
      step,
    });
  },
};
