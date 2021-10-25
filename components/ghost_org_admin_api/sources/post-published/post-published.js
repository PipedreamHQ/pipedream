const ghost_org_admin_api = require("../../ghost_org_admin_api.app.js");

module.exports = {
  key: "ghost_org_admin_api-post-published",
  name: "Post Published (Instant)",
  description: "Emits an event for each new post published on a site.",
  version: "0.0.2",
  props: {
    ghost_org_admin_api,
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      const data = {
        webhooks: [
          {
            event: "post.published",
            target_url: this.http.endpoint,
          },
        ],
      };
      const token = await this.ghost_org_admin_api._getToken();
      const resp = await this.ghost_org_admin_api.createHook(token, data);
      this.db.set("hookId", resp.data.webhooks[0].id);
      this.db.set("token", token);
    },
    async deactivate() {
      await this.ghost_org_admin_api.deleteHook(this.db.get("hookId"), this.db.get("token"));
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
