import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Delete Item",
  version: "0.0.1",
  key: "delete-item",
  description: "Deletes an item from a Miro board",
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
      description: "Shape (item) ID",
      optional: false,
    },
  },
  async run({ $: step }) {
    return this.app.deleteItem({
      step,
    });
  },
};
