import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-lesson-completed-instant",
  name: "Lesson Completed (Instant)",
  description: "Emit new event when a user completes a lesson in a course. [See the documentation](https://developers.thinkific.com/api/api-documentation/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    thinkific,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhook = await this.thinkific.createWebhook({
        url: this.http.endpoint,
        target: "lesson.completed",
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.thinkific.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const hmac = headers["X-Thinkific-Hmac-Sha256"];
    if (!this.thinkific.verifyHmac(body, hmac)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.thinkific.emitNewLessonCompletionEvent(body);
  },
};
