import app from "../../prodpad.app.mjs";

export default {
  key: "prodpad-pushed-idea",
  name: "New Pushed Idea",
  description: "Emit new event when an idea is pushed. [See the docs](https://help.prodpad.com/article/759-create-a-custom-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
  },
  async run({ body: resource }) {
    // eslint-disable-next-line no-prototype-builtins
    if (resource.hasOwnProperty("user_stories")) {
      this.$emit(resource, {
        id: resource.id,
        summary: `New Idea ${resource.id}`,
        ts: Date.parse(resource.created_at),
      });
    }
  },
};
