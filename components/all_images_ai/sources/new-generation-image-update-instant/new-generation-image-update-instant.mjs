import { axios } from "@pipedream/platform";
import allImagesAi from "../../all_images_ai.app.mjs";

export default {
  key: "all_images_ai-new-generation-image-update-instant",
  name: "New Generation Image Update (Instant)",
  description: "Emit new event when the generation status of an image gets updated.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    allImagesAi: {
      type: "app",
      app: "all_images_ai",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = `${this.http.endpoint}`;
      const events = [
        "image.generation.updated",
      ];
      const { data } = await this.allImagesAi.subscribeToWebhook({
        url: webhookUrl,
        events,
      });
      this.db.set("apiWebhookId", data.id);
    },
    async deactivate() {
      const apiWebhookId = this.db.get("apiWebhookId");
      if (apiWebhookId) {
        await this.allImagesAi.unsubscribeFromWebhook({
          apiWebhookId,
        });
        this.db.set("apiWebhookId", null);
      }
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `Image generation status updated for image ID: ${event.body.data.imageId}`,
      ts: Date.parse(event.body.created),
    });
  },
};
