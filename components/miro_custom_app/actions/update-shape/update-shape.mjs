import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Update Shape",
  version: "0.0.2",
  key: "update-shape",
  description: "Updates content of an existing shape on a Miro board",
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
    return this.app.updateShape({
      step,
      data: {
        content: this.content,
      },
    });
  },
};
