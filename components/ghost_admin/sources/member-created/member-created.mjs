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
      const {
        hookId,
        token,
      } = await this.ghost.createHook("member.added", this.http.endpoint);
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"), this.db.get("token"));
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
