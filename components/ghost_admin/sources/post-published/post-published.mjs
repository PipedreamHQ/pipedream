import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost-post-published",
  name: "Post Published (Instant)",
  description: "Emit new event for each new post published on a site.",
  version: "0.0.2",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("post.published", this.http.endpoint));
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.$emit(event.body, {
      id: event.body.post.current.id,
      summary: event.body.post.current.title,
      ts: Date.now(),
    });
  },
};
