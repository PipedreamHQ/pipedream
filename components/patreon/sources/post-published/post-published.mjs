import base from "../common/base.mjs";

export default {
  ...base,
  key: "patreon-post-published",
  name: "Post Published",
  description: "Emit new event for published post",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getTriggerType() {
      return "posts:publish";
    },
  },
  async run(event) {
    const id = event.body.data.id;
    const post = event.body.data.attributes.title;
    const ts = Date.parse(event.body.data.attributes.published_at);

    console.log("Emitting event...");

    this.$emit(event.body, {
      id,
      summary: `New post: ${post}`,
      ts,
    });
  },
};
