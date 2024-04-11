import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-new-full-enrollment-instant",
  name: "New Full Enrollment Instant",
  description: "Emits an event when a user enrolls in your course. [See the documentation](https://developers.thinkific.com/api/api-documentation/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    thinkific: {
      type: "app",
      app: "thinkific",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.thinkific.createWebhook("enrollment.completed", this.http.endpoint);
      this.db.set("webhookId", webhookId);
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
    if (headers["topic"] !== "enrollment.completed") {
      this.http.respond({
        status: 200,
      });
      return;
    }
    this.http.respond({
      status: 200,
    });
    this.$emit(body, {
      id: body.id,
      summary: `New enrollment: ${body.id}`,
      ts: Date.now(),
    });
  },
};
