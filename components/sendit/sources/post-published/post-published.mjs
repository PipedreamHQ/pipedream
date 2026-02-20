import sendIt from "../../sendit.app.mjs";

export default {
  key: "sendit-post-published",
  name: "New Post Published",
  description: "Emit new event when a post is successfully published. [See the documentation](https://sendit.infiniteappsai.com/docs/api)",
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
          "post.published",
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
    if (!this.sendIt.verifySignature(body, signature, webhookSecret)) {
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

    if (body && body.event === "post.published") {
      const deliveryId = body.deliveryId || `${body.timestamp}-${Date.now()}`;
      const platform = body.data?.platform || "unknown platform";

      this.$emit(body, {
        id: deliveryId,
        summary: `Post published to ${platform}`,
        ts: body.timestamp
          ? Date.parse(body.timestamp)
          : Date.now(),
      });
    }
  },
};
