import sendIt from "../../send_it.app.mjs";

export default {
  key: "send_it-post-scheduled",
  name: "New Post Scheduled",
  description: "Emit new event when a post is scheduled. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
  version: "0.0.1",
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
        events: [
          "post.scheduled",
        ],
      });

      if (!response?.webhook?.id) {
        throw new Error("Failed to create webhook: invalid response from SendIt API");
      }

      this.db.set("webhookId", response.webhook.id);
      this.db.set("webhookSecret", response.webhook.secret);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.sendIt.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["x-sendit-signature"];
    const webhookSecret = this.db.get("webhookSecret");

    // Verify signature before processing
    if (!this.sendIt.verifySignature(JSON.stringify(body), signature, webhookSecret)) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    if (body && body.event === "post.scheduled") {
      const deliveryId = body.deliveryId || `${body.timestamp}-${Date.now()}`;
      const scheduledTime = body.data?.scheduledTime || "unknown time";

      this.$emit(body, {
        id: deliveryId,
        summary: `Post scheduled for ${scheduledTime}`,
        ts: body.timestamp
          ? Date.parse(body.timestamp)
          : Date.now(),
      });
    }
  },
};
