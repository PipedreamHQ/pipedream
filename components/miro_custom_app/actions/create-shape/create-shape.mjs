import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Create Shape",
  version: "0.0.8",
  key: "create-shape",
  description: "Creates a shape on a Miro board",
  type: "action",
  props: {
    app,
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
      async options({ allBoards }) {
        const boardIds = await this.listBoards({
          allBoards,
        });
        return boardIds.map((boardId) => ({
          label: boardId.name,
          value: boardId.id,
        }));
      },
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
