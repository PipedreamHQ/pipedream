import circleci from "../../circleci.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "circleci-new-item-instant",
  name: "New Item Instant",
  description: "Emit new event when a new item is created in CircleCI. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    circleci: {
      type: "app",
      app: "circleci",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    newItemType: {
      propDefinition: [
        circleci,
        "newItemType",
      ],
      optional: true,
    },
    newItemStatus: {
      propDefinition: [
        circleci,
        "newItemStatus",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const signingSecret = crypto.randomBytes(20).toString("hex");
      const events = [
        "item-created",
      ];
      const data = {
        name: "Pipedream Webhook",
        events,
        url: webhookUrl,
        verify_tls: true,
        signing_secret: signingSecret,
        scope: {},
      };
      const response = await this.circleci._makeRequest({
        method: "POST",
        path: "/outbound_webhooks",
        data,
      });
      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
      await this.db.set("signingSecret", signingSecret);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.circleci._makeRequest({
          method: "DELETE",
          path: `/outbound_webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
        await this.db.delete("signingSecret");
      }
    },
    async deploy() {
      const params = {
        limit: 50,
      };
      if (this.newItemType) {
        params.type = this.newItemType;
      }
      if (this.newItemStatus) {
        params.status = this.newItemStatus;
      }
      const response = await this.circleci._makeRequest({
        method: "GET",
        path: "/items",
        params,
      });
      const items = response.items;
      if (items && items.length > 0) {
        for (const item of items.reverse()) {
          this.$emit(item, {
            id: item.id || Date.now(),
            summary: `New item: ${item.title}`,
            ts: Date.parse(item.created_at) || Date.now(),
          });
        }
      }
    },
  },
  async run(event) {
    const signature =
      event.headers["x-signature"] || event.headers["X-Signature"];
    const rawBody = event.body_raw || event.body;
    const signingSecret = await this.db.get("signingSecret");
    const computedSignature = crypto
      .createHmac("sha256", signingSecret)
      .update(rawBody)
      .digest("hex");
    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    const data = event.body;
    if (this.newItemType && data.type !== this.newItemType) {
      return;
    }
    if (this.newItemStatus && data.status !== this.newItemStatus) {
      return;
    }
    this.$emit(data, {
      id: data.id || Date.now(),
      summary: `New item: ${data.title}`,
      ts: Date.parse(data.created_at) || Date.now(),
    });
  },
};
