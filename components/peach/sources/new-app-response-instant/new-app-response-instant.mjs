import peach from "../../peach.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "peach-new-app-response-instant",
  name: "New App Response Instant",
  description: "Emit new event when a new app response is created on Peach. [See the documentation](https://peach.apidocumentation.com/reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    peach: {
      type: "app",
      app: "peach",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const responses = await this.peach.emitNewAppResponseCreated();
      for (const response of responses) {
        this.$emit(response, {
          id: response.id,
          summary: `New response: ${response.id}`,
          ts: Date.parse(response.created_at),
        });
      }
    },
    async activate() {
      const hookId = await this.peach.createWebhook();
      this.db.set("webhookId", hookId);
    },
    async deactivate() {
      const hookId = this.db.get("webhookId");
      await this.peach.deleteWebhook(hookId);
    },
  },
  async run(event) {
    const response = event.body;
    this.$emit(response, {
      id: response.id,
      summary: `New response: ${response.id}`,
      ts: Date.parse(response.created_at),
    });
  },
};
