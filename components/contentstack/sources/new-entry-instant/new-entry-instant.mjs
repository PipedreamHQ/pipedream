import contentstack from "../../contentstack.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "contentstack-new-entry-instant",
  name: "New Contentstack Entry",
  description: "Emit new event when a new entry is created in Contentstack. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentstack: {
      type: "app",
      app: "contentstack",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    stackId: {
      propDefinition: [
        contentstack,
        "stackId",
      ],
    },
    contentTypeUid: {
      propDefinition: [
        contentstack,
        "contentTypeUid",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookSecret() {
      return this.db.get("webhookSecret");
    },
    _setWebhookSecret(secret) {
      this.db.set("webhookSecret", secret);
    },
    async createWebhook() {
      const secret = crypto.randomBytes(32).toString("hex");
      const webhookData = {
        name: "Pipedream Webhook",
        url: this.http.url,
        events: [
          "entry.create",
        ],
        secret: secret,
      };
      const response = await this.contentstack._makeRequest({
        method: "POST",
        path: `/stacks/${this.stackId}/hooks`,
        data: webhookData,
      });
      await this._setWebhookSecret(secret);
      return response.uid;
    },
    async deleteWebhook(webhookId) {
      await this.contentstack._makeRequest({
        method: "DELETE",
        path: `/stacks/${this.stackId}/hooks/${webhookId}`,
      });
    },
    async fetchRecentEntries() {
      const entries = await this.contentstack.paginate(this.contentstack.listEntries, {
        contentTypeUid: this.contentTypeUid,
        limit: 50,
        sort: "-created_at",
      });
      return entries;
    },
  },
  hooks: {
    async deploy() {
      const entries = await this.fetchRecentEntries();
      for (const entry of entries) {
        this.$emit(
          {
            stackId: entry.stack.uid,
            entryId: entry.uid,
          },
          {
            id: entry.uid,
            summary: `New entry created: ${entry.title}`,
            ts: Date.parse(entry.created_at),
          },
        );
      }
    },
    async activate() {
      const webhookId = await this.createWebhook();
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.deleteWebhook(webhookId);
        this.db.delete("webhookId");
        this.db.delete("webhookSecret");
      }
    },
  },
  async run(event) {
    const secret = await this._getWebhookSecret();
    const signature = event.headers["x-contentstack-signature"];
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(event.rawBody)
      .digest("hex");

    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const entry = event.body.entry;
    const stackId = entry.stack.uid;
    const entryId = entry.uid;
    const timestamp = Date.parse(entry.created_at) || Date.now();

    this.$emit(
      {
        stackId,
        entryId,
      },
      {
        id: entryId,
        summary: `New entry created: ${entry.title}`,
        ts: timestamp,
      },
    );

    await this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
