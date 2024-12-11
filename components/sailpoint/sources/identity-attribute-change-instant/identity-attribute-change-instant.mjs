import sailpoint from "../../sailpoint.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "sailpoint-identity-attribute-change-instant",
  name: "Identity Attribute Change Instant",
  description: "Emit new event when any attributes of an identity change. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    sailpoint: {
      type: "app",
      app: "sailpoint",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    async createWebhook() {
      const callbackUrl = this.http.endpoint;
      const response = await this.sailpoint._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          triggerId: "idn:identity-attributes-changed",
          callbackUrl: callbackUrl,
        },
      });
      return response.id;
    },
    async deleteWebhook(webhookId) {
      await this.sailpoint._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    async listIdentityAttributeChanges() {
      const response = await this.sailpoint._makeRequest({
        method: "GET",
        path: "/identity-attributes-changed",
        params: {
          limit: 50,
          sort: "-timestamp",
        },
      });
      return response.events || [];
    },
  },
  hooks: {
    async deploy() {
      const events = await this.listIdentityAttributeChanges();
      for (const event of events.reverse()) {
        this.$emit(event.attributes, {
          id: event.id || event.timestamp.toString(),
          summary: `Attributes changed for identity ${event.identityId}`,
          ts: new Date(event.timestamp).getTime(),
        });
      }
    },
    async activate() {
      const webhookId = await this.createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.deleteWebhook(webhookId);
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Signature"] || event.headers["x-signature"];
    const secretKey = this.sailpoint.$auth.secret;
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(event.body)
      .digest("base64");
    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const data = JSON.parse(event.body);
    this.$emit(data.changedAttributes, {
      id: data.id || data.timestamp.toString(),
      summary: `Attributes changed for identity ${data.identityId}`,
      ts: Date.parse(data.timestamp) || Date.now(),
    });
  },
};
