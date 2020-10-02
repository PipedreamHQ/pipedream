const ghost = require("https://github.com/PipedreamHQ/pipedream/components/ghost/ghost-admin.app.js");

module.exports = {
  name: "Member Deleted (Instant)",
  description: "Emits an event each time a member is deleted from a site.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ghost,
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      const data = {
        webhooks: [
          {
            event: "member.deleted",
            target_url: this.http.endpoint,
          },
        ],
      };
      const token = await this.ghost._getToken();
      const resp = await this.ghost.createHook(token, data);
      this.db.set("hookId", resp.data.webhooks[0].id);
      this.db.set("token", token);
    },
    async deactivate() {
      await this.ghost.deleteHook(this.db.get("hookId"), this.db.get("token"));
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
