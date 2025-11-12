import allImagesAi from "../../all_images_ai.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "all_images_ai-new-generation-image-update-instant",
  name: "New Generation Image Update (Instant)",
  description: "Emit new event when the generation status of an image gets updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    allImagesAi,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.allImagesAi.createWebhook({
        data: {
          url: this.http.endpoint,
          events: [
            "print.created",
            "print.active",
            "print.progress",
            "print.failed",
            "print.completed",
          ],
        },
      });
      this._setHookId(webhookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.allImagesAi.deleteWebhook(hookId);
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: `Image generation status updated for image ID: ${body.type}`,
      ts: Date.parse(body.created),
    });
  },
  sampleEmit,
};
