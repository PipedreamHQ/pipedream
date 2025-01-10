import dixa from "../../dixa.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-new-customer-satisfaction-rating-instant",
  name: "New Customer Satisfaction Rating",
  description: "Emit new event when a customer submits a satisfaction rating for a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dixa,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    name: {
      type: "string",
      label: "Name",
      description: "Name of the event",
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    async createWebhook() {
      const data = {
        name: this.name,
        event_type: "conversationrated",
        callback_url: this.http.endpoint,
      };
      const response = await this.dixa._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      return response.id;
    },
    async deleteWebhook(id) {
      await this.dixa._makeRequest({
        method: "DELETE",
        path: `/webhooks/${id}`,
      });
    },
    async listRecentRatings() {
      const ratings = await this.dixa._makeRequest({
        method: "GET",
        path: "/ratings",
        params: {
          limit: 50,
          sort: "created_at_desc",
        },
      });
      return ratings;
    },
  },
  hooks: {
    async deploy() {
      const recentRatings = await this.listRecentRatings();
      const sortedRatings = recentRatings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      for (const rating of sortedRatings) {
        this.$emit(rating, {
          id: rating.id || `${rating.created_at}`,
          summary: `New satisfaction rating for conversation ${rating.conversation_id}`,
          ts: Date.parse(rating.created_at) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookId = await this._getWebhookId();
      if (!webhookId) {
        const id = await this.createWebhook();
        this._setWebhookId(id);
      }
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.deleteWebhook(webhookId);
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-dixa-signature"];
    const secret = this.dixa.$auth.webhook_secret;
    const hash = crypto.createHmac("sha256", secret).update(event.body)
      .digest("hex");

    if (hash !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const eventData = JSON.parse(event.body);
    if (eventData.event !== "conversationrated") {
      this.http.respond({
        status: 400,
        body: "Invalid event",
      });
      return;
    }

    const rating = eventData.data;

    this.$emit(rating, {
      id: rating.id || `${rating.created_at}`,
      summary: `New customer satisfaction rating received for conversation ${rating.conversation_id}`,
      ts: Date.parse(rating.created_at) || Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
