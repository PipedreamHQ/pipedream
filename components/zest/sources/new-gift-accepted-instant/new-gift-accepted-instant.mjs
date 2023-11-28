import zest from "../../zest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zest-new-gift-accepted-instant",
  name: "New Gift Accepted (Instant)",
  description: "Emits an event when a gift is accepted. [See the documentation](https://gifts.zest.co/admin/integrations/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zest: {
      type: "app",
      app: "zest",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    giftId: {
      propDefinition: [
        zest,
        "giftId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch last 50 accepted gifts and emit them as historical events
      const lastAcceptedGifts = await this.zest.getLastAcceptedGifts({
        limit: 50,
      });
      for (const gift of lastAcceptedGifts) {
        this.$emit(gift, {
          id: gift.id,
          summary: `Gift Accepted: ${gift.id}`,
          ts: Date.parse(gift.accepted_at),
        });
      }
    },
    async activate() {
      // Create a webhook subscription to receive events when gifts are accepted
      const webhookId = await this.zest.createWebhook({
        event: "gift.accepted",
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Delete the webhook subscription
      const webhookId = this.db.get("webhookId");
      await this.zest.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Verify the webhook signature
    if (!this.zest.verifyWebhookSignature({
      headers,
      body,
    })) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Respond to the webhook immediately
    this.http.respond({
      status: 200,
      body: "OK",
    });

    // Check if the event is for an accepted gift
    if (body.event === "gift.accepted" && body.data.id === this.giftId) {
      this.$emit(body, {
        id: body.data.id,
        summary: `Gift Accepted: ${body.data.id}`,
        ts: Date.parse(body.data.accepted_at),
      });
    }
  },
};
