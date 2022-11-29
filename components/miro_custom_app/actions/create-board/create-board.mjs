import app from "../../miro_custom_app.app.mjs";

export default {
  name: "Create Board",
  version: "0.0.7",
  key: "create-board",
  description: "Creates a Miro board",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      description: "Board name",
      optional: false,
    },
  },
  async run({ $: step }) {
    return this.app.createBoard({
      step,
      data: {
        name: this.name,
      },
    });
  },
};
