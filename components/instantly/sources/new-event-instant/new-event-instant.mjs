import instantly from "../../instantly.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "instantly-new-event-instant",
  name: "New Event in Instantly",
  description: "Emit new event when an activity occurs in your Instantly workspace. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    instantly: {
      type: "app",
      app: "instantly",
    },
    eventType: {
      propDefinition: [
        "instantly",
        "eventType",
      ],
    },
    campaign: {
      propDefinition: [
        "instantly",
        "campaign",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: {
      type: "$.service.db",
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    async createWebhook(callbackUrl) {
      const response = await this.instantly._makeRequest({
        method: "POST",
        path: "/webhook/create",
        data: {
          callback_url: callbackUrl,
          event_type: this.eventType,
          campaign_id: this.campaign,
        },
      });
      return response;
    },
    async deleteWebhook(webhookId) {
      await this.instantly._makeRequest({
        method: "POST",
        path: "/webhook/delete",
        data: {
          webhook_id: webhookId,
        },
      });
    },
    async listMostRecentEvents() {
      const events = await this.instantly._makeRequest({
        method: "GET",
        path: "/events/list",
        params: {
          event_type: this.eventType,
          campaign_id: this.campaign,
          limit: 50,
        },
      });
      return events;
    },
  },
  hooks: {
    async deploy() {
      const events = await this.listMostRecentEvents();
      for (const event of events) {
        this.$emit(event, {
          id: event.id || event.timestamp || Date.now(),
          summary: `New event: ${event.type} for campaign ${this.campaign}`,
          ts: event.timestamp
            ? Date.parse(event.timestamp)
            : Date.now(),
        });
      }
    },
    async activate() {
      const callbackUrl = this.http.endpoint;
      const webhook = await this.createWebhook(callbackUrl);
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.deleteWebhook(webhookId);
        await this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    const secret = this.instantly.$auth.api_key;
    const signature = event.headers["x-signature"];
    const rawBody = JSON.stringify(event.body);
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("base64");
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const eventData = event.body;
    this.$emit(eventData, {
      id: eventData.id || eventData.timestamp || Date.now(),
      summary: `New event: ${eventData.type} for campaign ${this.campaign}`,
      ts: eventData.timestamp
        ? Date.parse(eventData.timestamp)
        : Date.now(),
    });
  },
};
