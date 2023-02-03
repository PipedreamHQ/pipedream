import app from "../../prodpad.app.mjs";

export default {
  key: "prodpad-pushed-user-story",
  name: "New Pushed User Story",
  description: "Emit new event when a user story is pushed. [See the docs](https://help.prodpad.com/article/759-create-a-custom-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
