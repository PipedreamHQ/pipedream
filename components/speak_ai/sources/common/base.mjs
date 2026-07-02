import { ConfigurationError } from "@pipedream/platform";
import app from "../../speak_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const { data } = await this.app.subscribeWebhook({
        data: {
          callbackUrl: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this.setWebhookId(data.webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.app.unsubscribeWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    getSummary(resource) {
      return `New Speak AI event: ${resource.eventType || "delivery"}`;
    },
    async hydrate(resource) {
      return resource;
    },
    generateMeta(resource, data) {
      return {
        id: resource.deliveryId || resource.mediaId || resource.messageId,
        summary: this.getSummary(resource, data),
        ts: Date.now(),
      };
    },
    async processResource(resource) {
      const data = await this.hydrate(resource);
      this.$emit(data, this.generateMeta(resource, data));
    },
  },
  async run({ body }) {
    await this.processResource(body);
  },
};
