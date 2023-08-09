import zohoSprints from "../../zoho_sprints.app.mjs";

export default {
  props: {
    zohoSprints,
    db: "$.service.db",
    http: "$.interface.http",
    teamId: {
      propDefinition: [
        zohoSprints,
        "teamId",
      ],
    },
  },
  hooks: {
    async activate() {
      const data = new URLSearchParams();
      data.append("webhookname", "Pipedream Webhook");
      data.append("webhookurl", this.http.endpoint);
      data.append("module", this.getModule());
      data.append("predefinedtriggers", `["${this.getEventType()}"]`);
      data.append("method", "2");  // 2 = POST
      data.append("keyvalparams", JSON.stringify(this.getKeyValParams()));
      const { webhooksIds } = await this.zohoSprints.createWebhook({
        teamId: this.teamId,
        data,
      });
      this._setHookId(webhooksIds[0]);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.zohoSprints.deleteWebhook({
        teamId: this.teamId,
        webhookId,
      });
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getModule() {
      throw new Error("getModule is not implemented");
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getKeyValParams() {
      throw new Error("getKeyValParams is not implemented");
    },
  },
};
