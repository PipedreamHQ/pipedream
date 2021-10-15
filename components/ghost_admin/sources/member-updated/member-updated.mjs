import ghost from "../../ghost-admin.app.mjs";

export default {
  type: "source",
  key: "ghost_admin-member-updated",
  name: "Member Updated (Instant)",
  description: "Emit new event each time a member is updated.",
  version: "0.0.3",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      this.db.set("hookId", await this.ghost.createHook("member.edited", this.http.endpoint));
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
