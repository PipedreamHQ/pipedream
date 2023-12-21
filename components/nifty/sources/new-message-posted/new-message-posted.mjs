import nifty from "../../nifty.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "nifty-new-message-posted",
  name: "New Message Posted",
  description: "Emits an event when a new message is posted in a team's discussion. [See the documentation](https://openapi.niftypm.com/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    nifty,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        nifty,
        "projectId",
      ],
    },
    webhookUrl: {
      propDefinition: [
        nifty,
        "webhookUrl",
        (c) => ({
          url: c.http.endpoint,
        }),
      ],
    },
    eventType: {
      propDefinition: [
        nifty,
        "eventType",
        () => ({
          value: "message.created",
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit historical events during deploy
      const messages = await this.nifty.getMessages({
        projectId: this.projectId,
      });
      const sliceIndex = messages.length > 50
        ? messages.length - 50
        : 0;
      messages.slice(sliceIndex).forEach((message) => {
        this.$emit(message, {
          id: message.id,
          summary: `New message posted: ${message.content}`,
          ts: Date.parse(message.created_at),
        });
      });
    },
    async activate() {
      // Create a webhook
      const {
        projectId, webhookUrl, eventType,
      } = this;
      const webhook = await this.nifty.createWebhook({
        projectId,
        webhookUrl,
        eventType: eventType.value,
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      // Remove the webhook
      const webhookId = this.db.get("webhookId");
      await this.nifty.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const webhookId = this.db.get("webhookId");
    const webhookSecret = this.nifty.$auth.oauth_access_token;
    const computedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");
    const receivedSignature = headers["x-nifty-signature"];

    if (computedSignature !== receivedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New message posted in project with ID: ${this.projectId}`,
      ts: Date.parse(body.created_at),
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
