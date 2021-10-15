import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost_admin-new-tag",
  name: "Tag Added (Instant)",
  description: "Emit new event for each new tag created on a site.",
  version: "0.0.3",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("tag.added", this.http.endpoint));
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.$emit(event.body, {
      id: event.body.tag.current.id,
      summary: event.body.tag.current.name,
      ts: Date.now(),
    });
  },
};
