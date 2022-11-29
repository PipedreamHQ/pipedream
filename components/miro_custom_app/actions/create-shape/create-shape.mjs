import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Create Shape",
  version: "0.1.0",
  key: "create-shape",
  description: "Creates a shape on a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
    },
    shapeType: {
      type: "string",
      description: "Shape type (rectangle, circle, star, etc.)",
      optional: false,
    },
    content: {
      type: "string",
      description: "Text content for shape",
      optional: true,
    },
  },
  async run({ $: step }) {
    return this.app.createShape({
      step,
      data: {
        shape: this.shapeType,
        content: this.content,
      },
    });
  },
};
