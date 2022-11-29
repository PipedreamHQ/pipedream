import app from "../../miro_custom_app.app.mjs";

export default {
  name: "List Boards",
  version: "0.0.1",
  key: "list-boards",
  description: "Returns a user's Miro boards",
  type: "action",
  props: {
    app,
  },
  async run({ $: step }) {
    return this.app.listBoards({
      step,
    });
  },
};
