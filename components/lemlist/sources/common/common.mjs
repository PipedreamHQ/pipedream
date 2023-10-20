import lemlist from "../../lemlist.app.mjs";
export default {
  props: {
    lemlist,
    campaignId: {
      propDefinition: [
        lemlist,
        "campaignId",
      ],
      optional: true,
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getHook() {
      return this.db.get("webhookId");
    },
    _setHook(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEventTypes() {
      return null;
    },
    proccessEvent(event) {
      throw new Error("proccessEvent is not implemented", event);
    },
    async createWebHook(types) {
      return this.lemlist.createWebhook({
        data: {
          targetUrl: this.http.endpoint,
          campaignId: this.campaignId,
          type: types,
        },
      });
    },
    async loadHistoricalData() {
      console.log("No historical data for this event");
    },
  },
  hooks: {
    async deploy() {
      // Retrieve historical events
      const events = await this.loadHistoricalData();
      if (events) {
        for (const event of events) {
          this.$emit(event.main, event.sub);
        }
      }

    },
    async activate() {
      const types = this.getWebhookEventTypes();
      const response = await this.createWebHook(types);
      this._setHook(response._id);
    },
    async deactivate() {
      const hookId = this._getHook();
      return this.lemlist.removeWebhook({
        hookId,
      });
    },
  },
  async run(event) {
    this.proccessEvent(event);
  },
};
