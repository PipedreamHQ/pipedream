import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost-page-published",
  name: "Page Published (Instant)",
  description: "Emit new event for each new page published on a site.",
  version: "0.0.3",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("page.published", this.http.endpoint));
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.$emit(event.body, {
      id: event.body.page.current.id,
      summary: event.body.page.current.title,
      ts: Date.now(),
    });
  },
};
