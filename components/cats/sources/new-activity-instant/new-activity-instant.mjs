import cats from "../../cats.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "cats-new-activity-instant",
  name: "New Activity Instant",
  description: "Emit a new event when an activity related to a cat is created. [See the documentation](https://docs.catsone.com/api/v3/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    cats,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const activities = await this.cats._makeRequest({
        path: "/activities",
        params: {
          limit: 50,
          order_by: "created_at.desc",
        },
      });
      for (const activity of activities) {
        this.$emit(activity, {
          id: activity.id,
          summary: `New activity: ${activity.type}`,
          ts: Date.parse(activity.created_at),
        });
      }
    },
    async activate() {
      const webhookConfig = {
        events: [
          "activity.created",
        ],
        target_url: this.http.endpoint,
        secret: process.env.CATS_WEBHOOK_SECRET, // Assuming secret is stored as environment variable
      };
      const webhookResponse = await this.cats._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: webhookConfig,
      });
      this._setWebhookId(webhookResponse.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.cats._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const secret = process.env.CATS_WEBHOOK_SECRET; // Assuming secret is stored as environment variable
    const signature = event.headers["x-signature"];
    const requestId = event.headers["x-request-id"];
    const payload = JSON.stringify(event.body) + requestId;
    const computedSignature = `HMAC-SHA256 ${crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex")}`;

    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });
    const activity = event.body;
    this.$emit(activity, {
      id: activity.id,
      summary: `New activity: ${activity.type}`,
      ts: Date.parse(activity.created_at),
    });
  },
};
