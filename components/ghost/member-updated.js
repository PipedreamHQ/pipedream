const ghost = require("https://github.com/PipedreamHQ/pipedream/components/ghost/ghost-admin.app.js");

module.exports = {
  name: "Member Updated (Instant)",
  description: "Emits an event each time a member is updated.",
  version: "0.0.1",
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
            event: "member.edited",
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
      id: event.body.member.current.id,
      summary: event.body.member.current.name,
      ts: Date.now(),
    });
  },
};