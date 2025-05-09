import guru from "../../guru.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "guru-card-updated-instant",
  name: "New Card Update Event",
  description: "Emit an event when a user makes an edit to a card. [See the documentation](https://developer.getguru.com/reference/authentication)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    guru,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    cardId: {
      propDefinition: [
        guru,
        "cardId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const cardDetails = await this.guru.emitCardUpdatedEvent({
        cardId: this.cardId,
      });

      this.$emit(cardDetails, {
        id: cardDetails.id,
        summary: `Last Card Update: ${cardDetails.title}`,
        ts: new Date(cardDetails.lastModified).getTime(),
      });
    },
    async activate() {
      const response = await this.guru._makeRequest({
        path: "/webhooks",
        method: "POST",
        data: {
          deliveryMode: "BATCH",
          targetUrl: "https://yourserver.com/webhook-handler",
          status: "ENABLED",
          filter: "card-updated",
        },
      });
      this.webhookId = response.id;
    },
    async deactivate() {
      if (!this.webhookId) {
        console.log("No webhook ID found, skipping deactivation");
        return;
      }
      await this.guru._makeRequest({
        path: `/webhooks/${this.webhookId}`,
        method: "DELETE",
      });
    },
  },
  async run() {
    const cardDetails = await this.guru.emitCardUpdatedEvent({
      cardId: this.cardId,
    });

    this.$emit(cardDetails, {
      id: cardDetails.id,
      summary: `Card Updated: ${cardDetails.title}`,
      ts: new Date(cardDetails.lastModified).getTime(),
    });
  },
};
