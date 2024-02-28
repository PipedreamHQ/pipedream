import contentSnare from "../../content_snare.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "content_snare-new-request-published-instant",
  name: "New Request Published (Instant)",
  description: "Emits an event when a request is published on Content Snare. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentSnare,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    ...contentSnare.methods,
  },
  hooks: {
    async deploy() {
      const { data: requests } = await this.contentSnare.listRequests();
      const recentRequests = requests.slice(-50).reverse();
      for (const request of recentRequests) {
        this.$emit(request, {
          id: request.id,
          summary: `New request published: ${request.name}`,
          ts: Date.parse(request.updated_at || request.created_at),
        });
      }
    },
    async activate() {
      // Assuming Content Snare supports webhooks
      const { data: webhook } = await this.contentSnare.createWebhook({
        event: "request.published",
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.contentSnare.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const { body, headers } = event;

    // Validate the signature
    const secretKey = this.contentSnare.$auth.oauth_access_token;
    const webhookSignature = headers['x-content-snare-signature'];

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(JSON.stringify(body))
      .digest("hex");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New request published: ${body.name}`,
      ts: Date.parse(body.updated_at || body.created_at),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};