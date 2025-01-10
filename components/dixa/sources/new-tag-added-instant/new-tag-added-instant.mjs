import dixa from "../../dixa.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "dixa-new-tag-added-instant",
  name: "New Tag Added in Conversation",
  description: "Emit new event when a tag is added to a conversation. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dixa: {
      type: "app",
      app: "dixa",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    name: {
      propDefinition: [
        dixa,
        "name",
      ],
    },
  },
  methods: {
    async createWebhook() {
      const webhookData = {
        event: "conversationtagadded",
        callback_url: this.http.endpoint,
        name: this.name,
      };
      const response = await this.dixa._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: webhookData,
      });
      return response.id;
    },
    async deleteWebhook(webhookId) {
      await this.dixa._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
    async fetchRecentTags() {
      const events = await this.dixa.paginate(this.dixa.listEvents, {
        eventType: "conversationtagadded",
        limit: 50,
      });
      return events;
    },
  },
  hooks: {
    async deploy() {
      const recentTags = await this.fetchRecentTags();
      recentTags.forEach((tag) => {
        this.$emit(tag, {
          id: tag.id || tag.timestamp,
          summary: `Tag "${tag.tagName}" added to conversation ${tag.conversationId}`,
          ts: tag.timestamp
            ? Date.parse(tag.timestamp)
            : Date.now(),
        });
      });
    },
    async activate() {
      const webhookId = await this.createWebhook();
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Dixa-Signature"] || event.headers["x-dixa-signature"];
    const secret = this.dixa.$auth.webhook_secret;
    const computedSignature = crypto.createHmac("sha256", secret).update(event.rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const tagEvent = event.body;

    this.$emit(tagEvent, {
      id: tagEvent.id || tagEvent.timestamp,
      summary: `Tag "${tagEvent.tagName}" added to conversation ${tagEvent.conversationId}`,
      ts: tagEvent.timestamp
        ? Date.parse(tagEvent.timestamp)
        : Date.now(),
    });

    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
