import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Update Sticky Note",
  version: "0.0.1",
  key: "update-sticky-note",
  description: "Updates content of an existing sticky note on a Miro board",
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
    content: {
      type: "string",
      description: "Text content for shape",
      optional: false,
    },
  },
  async run({ $: step }) {
    return this.app.updateStickyNote({
      step,
      data: {
        content: this.content,
      },
    });
  },
};
