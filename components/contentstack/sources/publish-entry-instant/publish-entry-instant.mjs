import crypto from "crypto";
import contentstack from "../../contentstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-publish-entry-instant",
  name: "Contentstack - Entry Published",
  description: "Emit new event when content is live on your website. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentstack,
    stackId: {
      propDefinition: [
        contentstack,
        "stackId",
      ],
    },
    entryId: {
      propDefinition: [
        contentstack,
        "entryId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    secret: {
      type: "string",
      label: "Webhook Secret",
      description: "The secret used to validate webhook signatures",
      secret: true,
      optional: true,
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
      const webhookName = `Pipedream Webhook - ${Date.now()}`;
      const webhookUrl = this.http.endpoint;

      const webhookData = {
        name: webhookName,
        url: webhookUrl,
        events: [
          "entry.publish",
        ],
        ...(this.secret
          ? {
            secret: this.secret,
          }
          : {}),
        stack_uid: this.stackId,
      };

      const response = await this.contentstack._makeRequest({
        method: "POST",
        path: `/stacks/${this.stackId}/webhooks`,
        data: webhookData,
      });

      const webhookId = response.uid;
      this._setWebhookId(webhookId);
    },
    async deleteWebhook() {
      const webhookId = this._getWebhookId();

      if (webhookId) {
        await this.contentstack._makeRequest({
          method: "DELETE",
          path: `/stacks/${this.stackId}/webhooks/${webhookId}`,
        });
      }
    },
    async listRecentEntries() {
      const query = JSON.stringify({
        uid: this.entryId,
        locale: "*",
      });

      const entries = await this.contentstack.paginate(this.contentstack.listEntries, {
        query,
      });

      return entries;
    },
    validateSignature(payload, signature) {
      if (!this.secret) return true;
      const hash = crypto.createHmac("sha256", this.secret).update(payload)
        .digest("base64");
      return hash === signature;
    },
  },
  hooks: {
    async deploy() {
      const entries = await this.listRecentEntries();

      const recentEntries = entries.slice(-50);
      for (const entry of recentEntries) {
        this.$emit(
          {
            stackId: this.stackId,
            entryId: entry.uid,
          },
          {
            id: entry.uid,
            summary: `Entry published: ${entry.title}`,
            ts: Date.parse(entry.publish_details.livesite_at) || Date.now(),
          },
        );
      }
    },
    async activate() {
      await this.createWebhook();
    },
    async deactivate() {
      await this.deleteWebhook();
    },
  },
  async run(event) {
    const signature = event.headers["x-contentstack-signature"];
    const rawBody = JSON.stringify(event.body);

    if (this.secret) {
      const isValid = this.validateSignature(rawBody, signature);
      if (!isValid) {
        this.http.respond({
          status: 401,
          body: "Unauthorized",
        });
        return;
      }
    }

    const entry = event.body.entry;

    if (entry.uid !== this.entryId) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    this.$emit(
      {
        stackId: this.stackId,
        entryId: entry.uid,
      },
      {
        id: entry.uid,
        summary: `Entry published in stack ${this.stackId}`,
        ts: Date.parse(entry.publish_details.livesite_at) || Date.now(),
      },
    );

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
