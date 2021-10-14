import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost_admin-member-created",
  name: "New Member Created (Instant)",
  description: "Emit new event for each new member added to a site.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("member.added", this.http.endpoint));
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.member.current.id,
      summary: event.body.member.current.name,
      ts: Date.now(),
    });
  },
};
