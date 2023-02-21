import wrike from "../../wrike.app.mjs";

export default {
  type: "source",
  props: {
    wrike,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async activate() {
      console.log("Creating webhook...");
      const { id } = await this.wrike.createWebhook({
        data: {
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.wrike.deleteWebhook({
        id: this._getWebhookId(),
      });
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    emitEvent() {
      throw new Error("Missing implementation for emitEvent() method");
    },
  },
  async run(event) {
    console.log("Webhook received");
    const data = event.body.data;
    this.emitEvent(data);
  },
};
