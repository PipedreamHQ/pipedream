import amilia from "../../amilia.app.mjs";

export default {
  type: "source",
  props: {
    amilia,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async activate() {
      const webhookData = this.getWebhookData();
      console.log(`Creating ${webhookData.Name}...`);
      const { Id: id } = await this.amilia.createWebhook({
        data: {
          ...webhookData,
          Version: "V1",
          Url: this.http.endpoint,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.amilia.deleteWebhook({
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
    getWebhookData() {
      throw new Error("Missing implementation for getWebhookData() method");
    },
    processEvent() {
      throw new Error("Missing implementation for processEvent() method");
    },
  },
  async run(event) {
    if (event.body) {
      await this.processEvent(event.body);
    }
  },
};
