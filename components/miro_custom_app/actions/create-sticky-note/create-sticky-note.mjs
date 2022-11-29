import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Create Sticky Note",
  version: "0.0.2",
  key: "create-sticky-note",
  description: "Creates a sticky note on a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
    },
    content: {
      type: "string",
      description: "Text content for sticky note",
      optional: true,
    },
  },
  async run({ $: step }) {
    return this.app.createStickyNote({
      step,
      data: {
        content: this.content,
      },
    });
  },
};
