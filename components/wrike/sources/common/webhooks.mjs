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
      const response = await this.wrike.createWebhook({
        folderId: this.folderId,
        spaceId: this.spaceId,
        data: {
          hookUrl: this.http.endpoint,
          recursive: this.recursive,
          events: this.getEventTypes(),
        },
      });
      const webhookId = response.data[0].id;
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      console.log("Deleting webhook...");
      await this.wrike.deleteWebhook({
        webhookId: this._getWebhookId(),
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
    getEventTypes() {
      const eventTypes = this.eventTypes();
      return `[${eventTypes.join(",")}]`;
    },
    eventTypes() {
      throw new Error("Missing implementation for eventTypes() method");
    },
    emitEvent() {
      throw new Error("Missing implementation for emitEvent() method");
    },
  },
};
