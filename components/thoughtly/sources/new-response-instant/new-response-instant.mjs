import thoughtly from "../../thoughtly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "thoughtly-new-response-instant",
  name: "New Response Instant",
  description: "Emit new event when a thoughtly gets a new response.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    thoughtly: {
      type: "app",
      app: "thoughtly",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    type: thoughtly.propDefinitions.type,
    url: thoughtly.propDefinitions.url,
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.thoughtly.subscribeToWebhook({
        type: this.type,
        url: this.url,
      });
      this.db.set("subscriptionId", response.data.id);
    },
    async deactivate() {
      const subscriptionId = this.db.get("subscriptionId");
      await this.thoughtly.unsubscribeFromWebhook({
        idMetadata: subscriptionId,
      });
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id || `${Date.now()}`,
      summary: "New response received",
      ts: Date.now(),
    });
  },
};
