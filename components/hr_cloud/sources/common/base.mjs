import { ConfigurationError } from "@pipedream/platform";
import hrCloud from "../../hr_cloud.app.mjs";

export default {
  dedupe: "unique",
  props: {
    hrCloud,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.hrCloud.createWebhook({
        eventType: this.getEventType(),
        endpoint: this.http.endpoint,
        metadata: this.getMetadata(),
      });

      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.hrCloud.deleteWebhook(webhookId);
      }
    },
  },
  methods: {
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    getMetadata() {
      return {};
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
