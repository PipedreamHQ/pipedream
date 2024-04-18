import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-new-reply-from-you-instant",
  name: "New Reply from You Instant",
  description: "Emits an event when the videoasker replies to a respondent",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    videoask: {
      type: "app",
      app: "videoask",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      // Create a webhook subscription in the activate() hook
      const { data } = await this.videoask.createWebhook({
        targetUrl: this.http.endpoint,
        events: [
          "new_reply_from_you_instant",
        ],
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      // Delete the webhook subscription in the deactivate() hook
      await this.videoask.deleteWebhook({
        id: this.db.get("webhookId"),
      });
    },
  },
  async run(event) {
    // Validate the incoming event
    if (event.headers["x-videoask-signature"] !== this.videoask.$auth.webhook_secret) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New reply from you on form ${event.body.form_id}`,
      ts: Date.parse(event.body.created_at),
    });
  },
};
