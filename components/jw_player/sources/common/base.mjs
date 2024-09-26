import jwPlayer from "../../jw_player.app.mjs";

export default {
  props: {
    jwPlayer,
    db: "$.service.db",
    http: "$.interface.http",
    siteIds: {
      propDefinition: [
        jwPlayer,
        "siteId",
      ],
      type: "string[]",
      label: "Site IDs",
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.jwPlayer.createWebhook({
        data: {
          metadata: {
            webhook_url: this.http.endpoint,
            events: this.getEvents(),
            name: "Pipedream Webhook",
            site_ids: this.siteIds,
          },
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.jwPlayer.deleteWebhook({
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
