import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-new-activity-instant",
  name: "New Activity Instant",
  description: "Emits new event whenever a new activity is logged in timebuzzer.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    timebuzzer: {
      type: "app",
      app: "timebuzzer",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.timebuzzer.createActivity({
        name: "Webhook",
        type: "webhook",
        config: {
          url: this.http.endpoint,
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.timebuzzer.deleteActivity(webhookId);
    },
  },
  async run(event) {
    if (event.method !== "POST") {
      return;
    }

    const {
      body, headers,
    } = event;

    if (!body || !headers) {
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: body.name,
      ts: Date.now(),
    });
  },
};
