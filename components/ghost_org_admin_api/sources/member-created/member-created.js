const ghost_org_admin_api = require("../../ghost_org_admin_api.app.js");

module.exports = {
  key: "ghost_org_admin_api-member-created",
  name: "Member Created (Instant)",
  description: "Emits an event for each new member added to a site.",
  version: "0.0.2",
  dedupe: "unique",
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
            event: "member.added",
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
      id: event.body.member.current.id,
      summary: event.body.member.current.name,
      ts: Date.now(),
    });
  },
};
