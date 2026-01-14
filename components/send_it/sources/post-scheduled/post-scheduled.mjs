import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-post-scheduled",
  name: "New Post Scheduled",
  description: "Emit new event when a post is scheduled. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  props: {
    sendIt,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const response = await this.sendIt.createWebhook({
        url: this.http.endpoint,
        events: ["post.scheduled"],
      });
      this.db.set("webhookId", response.webhook.id);
      this.db.set("webhookSecret", response.webhook.secret);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sendIt.deleteWebhook({ webhookId });
      }
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: "OK",
    });

    const { body } = event;

    if (body && body.event === "post.scheduled") {
      this.$emit(body, {
        id: body.deliveryId,
        summary: `Post scheduled for ${body.data?.scheduledTime}`,
        ts: body.timestamp ? Date.parse(body.timestamp) : Date.now(),
      });
    }
  },
};
