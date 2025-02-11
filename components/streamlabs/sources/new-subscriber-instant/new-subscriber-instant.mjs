import streamlabs from "../../streamlabs.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "streamlabs-new-subscriber-instant",
  name: "New Subscriber (Instant)",
  description: "Emit new event when a viewer subscribes to the streamer's channel. [See the documentation]()",
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
    subscriptionPlanTier: {
      propDefinition: [
        "streamlabs",
        "subscriptionPlanTier",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const params = this.subscriptionPlanTier
        ? {
          tier: this.subscriptionPlanTier,
        }
        : {};
      const subscriptions = await this.streamlabs.paginate(this.streamlabs.emitSubscribeEvent, params);
      const recentSubscriptions = subscriptions.slice(-50);
      for (const subscription of recentSubscriptions) {
        this.$emit(subscription, {
          id: subscription.id || subscription.ts,
          summary: `New subscription from ${subscription.username}`,
          ts: new Date(subscription.created_at).getTime(),
        });
      }
    },
    async activate() {
      const callbackUrl = this.http.endpoint;
      const data = {
        url: callbackUrl,
        event: "subscribe",
        ...(this.subscriptionPlanTier
          ? {
            tier: this.subscriptionPlanTier,
          }
          : {}),
      };
      const webhook = await this.streamlabs._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.streamlabs._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const rawBody = event.rawBody;
    const signature = event.headers["X-Streamlabs-Signature"];

    const secret = this.streamlabs.$auth.secret;
    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const subscription = event.body;

    if (this.subscriptionPlanTier && subscription.tier !== this.subscriptionPlanTier) {
      this.http.respond({
        status: 200,
        body: "Ignored",
      });
      return;
    }

    this.$emit(subscription, {
      id: subscription.id || subscription.ts,
      summary: `New subscription from ${subscription.username}`,
      ts: Date.parse(subscription.created_at) || Date.now(),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
