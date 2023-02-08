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
    http: "$.interface.http",
  },
  async run({ body: resource }) {
    // eslint-disable-next-line no-prototype-builtins
    if (resource.hasOwnProperty("story")) {
      this.$emit(resource, {
        id: resource.id,
        summary: `New User Story ${resource.id}`,
        ts: Date.parse(resource.created_at),
      });
    }
  },
};
