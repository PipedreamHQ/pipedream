import streamlabs from "../../streamlabs.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "streamlabs-new-tip-instant",
  name: "New Tip Received (Instant)",
  description: "Emit new event when a viewer sends a tip to the streamer in real-time. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    streamlabs: {
      type: "app",
      app: "streamlabs",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    minTipAmount: {
      propDefinition: [
        streamlabs,
        "minTipAmount",
      ],
      optional: true,
    },
  },
  methods: {
    async _createWebhook() {
      const webhookUrl = this.http.endpoint;
      const response = await this.streamlabs._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: webhookUrl,
          event: "tip",
          secret: this.streamlabs.$auth.webhook_secret,
        },
      });
      return response.id;
    },
    async _deleteWebhook(webhookId) {
      await this.streamlabs._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    _verifySignature(rawBody, signature) {
      const computedSignature = crypto
        .createHmac("sha256", this.streamlabs.$auth.webhook_secret)
        .update(rawBody)
        .digest("hex");
      return computedSignature === signature;
    },
  },
  hooks: {
    async deploy() {
      const recentTips = await this.streamlabs.emitTipEvent({
        minTipAmount: this.minTipAmount,
        paginate: true,
        max: 50,
      });
      for (const tip of recentTips) {
        this.$emit(tip, {
          id: tip.id || tip.timestamp,
          summary: `New tip from ${tip.username}: $${tip.amount}`,
          ts: Date.parse(tip.timestamp) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookId = await this._createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this._deleteWebhook(webhookId);
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-streamlabs-signature"];
    const rawBody = event.rawBody;
    if (!this._verifySignature(rawBody, signature)) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const tip = event.body;

    if (this.minTipAmount && tip.amount < this.minTipAmount) {
      await this.http.respond({
        status: 200,
        body: "Tip below minimum amount",
      });
      return;
    }

    this.$emit(tip, {
      id: tip.id || tip.timestamp,
      summary: `New tip from ${tip.username}: $${tip.amount}`,
      ts: Date.parse(tip.timestamp) || Date.now(),
    });

    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
