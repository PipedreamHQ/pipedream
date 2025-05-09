import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import guru from "../../guru.app.mjs";

export default {
  key: "guru-new-card-instant",
  name: "New Card Created",
  description: "Emit new event when a new card is published. [See the documentation](https://developer.getguru.com/docs/creating-a-webhook)",
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
  },
  hooks: {
    async deploy() {
      const cards = await this.fetchRecentCards();
      for (const card of cards.slice(0, 50)) {
        this.$emit(card, {
          id: card.id,
          summary: `New Card: ${card.title}`,
          ts: Date.parse(card.createdAt),
        });
      }
    },
    async activate() {
      await this.createWebhook();
    },
    async deactivate() {
      await this.deleteWebhook();
    },
  },
  methods: {
    async createWebhook() {
      const response = await axios(this, {
        method: "POST",
        url: `${this.guru._baseUrl()}/webhooks`,
        headers: {
          Authorization: `Bearer ${this.guru.$auth.oauth_access_token}`,
        },
        data: {
          deliveryMode: "BATCH",
          targetUrl: "https://endpoint.m.pipedream.net", // Replace with your unique Pipedream Webhook URL
          status: "ENABLED",
          filter: "card-created",
        },
      });
      this.db.set("webhookId", response.id);
    },
    async deleteWebhook() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) return;

      await axios(this, {
        method: "DELETE",
        url: `${this.guru._baseUrl()}/webhooks/${webhookId}`,
        headers: {
          Authorization: `Bearer ${this.guru.$auth.oauth_access_token}`,
        },
      });
      this.db.set("webhookId", null);
    },
    async fetchRecentCards() {
      const allCards = await this.guru.emitCardCreatedEvent();
      return allCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },
  async run(event) {
    const payload = event.body;
    if (!payload) {
      console.log("No payload found, skipping");
      return;
    }
    for (const card of payload) {
      this.$emit(card, {
        id: card.id,
        summary: `New Card: ${card.title}`,
        ts: Date.parse(card.dateCreated),
      });
    }
  },
};
