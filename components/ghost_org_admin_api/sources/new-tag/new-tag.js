const ghost_org_admin_api = require("../../ghost_org_admin_api.app.js");

module.exports = {
  key: "ghost_org_admin_api-new-tag",
  name: "Tag Added (Instant)",
  description: "Emits an event for each new tag created on a site.",
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
            event: "tag.added",
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
      id: event.body.tag.current.id,
      summary: event.body.tag.current.name,
      ts: Date.now(),
    });
  },
};
