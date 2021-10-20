import common from "../common-webhook.mjs";

export default {
  ...common,
  type: "source",
  key: "ghost-post-published",
  name: "Post Published (Instant)",
  description: "Emit new event for each new post published on a site.",
  version: "0.0.4",
  methods: {
    ...common.methods,
    getEvent() {
      return "post.published";
    },
    generateMeta(body) {
      return ({
        id: body.post.current.id,
        summary: body.post.current.title,
        ts: Date.now(),
      });
    },
  },
};
