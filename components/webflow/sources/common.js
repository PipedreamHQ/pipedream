const { v4: uuidv4 } = require("uuid");
const webflow = require("../webflow.app");

module.exports = {
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    webflow,
  },
  methods: {
    getWebhookTriggerType() {
      throw new Error('getWebhookTriggerType is not implemented');
    },
    getWebhookFilter() {
      return {};
    },
    dateIsoStringToTimestamp(date) {
      return Math.floor(Date.parse(date) / 1000);
    },
    generateMeta(data) {
      return {
        id: uuidv4(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    processEvent(event) {
      const { body } = event;
      const meta = this.generateMeta(event);
      this.$emit(body, meta);
    },
  },
  hooks: {
    async activate() {
      const { endpoint } = this.http;
      const triggerType = this.getWebhookTriggerType();
      const filter = this.getWebhookFilter();
      const {
        _id: webhookId,
      } = await this.webflow.createWebhook(endpoint, triggerType, filter);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.webflow.removeWebhook(webhookId);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
