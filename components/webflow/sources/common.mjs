import webflow from "../webflow.app.mjs";
import { v4 as uuid } from "uuid";

export default {
  dedupe: "unique",
  props: {
    webflow,
    siteId: {
      propDefinition: [
        webflow,
        "sites",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    getWebhookTriggerType() {
      throw new Error("getWebhookTriggerType is not implemented");
    },
    getWebhookFilter() {
      return {};
    },
    isEventRelevant(event) {
      if (event) return true;
    },
    generateMeta(data) {
      return {
        id: data.id || uuid(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    processEvent(event) {
      if (!this.isEventRelevant(event)) {
        return;
      }

      const { body } = event;
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    },
  },
  hooks: {
    async activate() {
      const { endpoint } = this.http;
      const triggerType = this.getWebhookTriggerType();
      const filter = this.getWebhookFilter();
      const webhook = await this.webflow.createWebhook(
        this.siteId, endpoint, triggerType, filter,
      );

      this.db.set("webhookId", webhook._id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.webflow.removeWebhook(this.siteId, webhookId);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
