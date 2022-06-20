import app from "../../zenkit.app.mjs";

export default {
  key: "zenkit-create-item",
  name: "Create Item",
  description: "Create a new item in Zenkit",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    this.app.authKeys();
    $.export("summary", "Successfully created item");
  },
};
