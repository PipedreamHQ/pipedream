import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost_admin-member-deleted",
  name: "Member Deleted (Instant)",
  description: "Emit new event each time a member is deleted from a site.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("member.deleted", this.http.endpoint));
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"));
    },
  },

  async run(event) {
    this.$emit(event.body, {
      id: event.body.member.previous.id,
      summary: event.body.member.previous.name,
      ts: Date.now(),
    });
  },
};
