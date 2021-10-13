const ghost = require("../../ghost-admin.app.js");

module.exports = {
  type: "source",
  key: "ghost-page-published",
  name: "Page Published (Instant)",
  description: "Emit new event for each new page published on a site.",
  version: "0.0.2",
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
            event: "page.published",
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
      id: event.body.page.current.id,
      summary: event.body.page.current.title,
      ts: Date.now(),
    });
  },
};
