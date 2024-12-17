import circleci from "../../circleci.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "circleci-new-comment-instant",
  name: "New Comment Added",
  description: "Emit new event when a comment is added to an existing item. [See the documentation]()",
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
    commentItemType: {
      propDefinition: [
        "circleci",
        "commentItemType",
      ],
      optional: true,
    },
    commentUser: {
      propDefinition: [
        "circleci",
        "commentUser",
      ],
      optional: true,
    },
    signingSecret: {
      type: "string",
      label: "Signing Secret",
      description: "Secret used to validate webhook signatures",
      secret: true,
    },
    verifyTls: {
      type: "boolean",
      label: "Verify TLS",
      description: "Whether to enforce TLS certificate verification",
      default: true,
    },
    webhookName: {
      type: "string",
      label: "Webhook Name",
      description: "Name of the webhook",
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _verifySignature(payload, signature) {
      const computedSignature = crypto.createHmac("sha256", this.signingSecret)
        .update(JSON.stringify(payload))
        .digest("hex");
      return computedSignature === signature;
    },
    _applyFilters(event) {
      const {
        commentItemType, commentUser,
      } = this;
      if (commentItemType && event.itemType !== commentItemType) {
        return false;
      }
      if (commentUser && event.user !== commentUser) {
        return false;
      }
      return true;
    },
  },
  hooks: {
    async deploy() {
      const comments = await this.circleci.listComments({
        paginate: true,
        max: 50,
      });
      for (const comment of comments) {
        this.$emit(comment, {
          id: comment.id || comment.ts || Date.now().toString(),
          summary: `New comment by ${comment.user} on item ${comment.itemId}`,
          ts: comment.timestamp
            ? Date.parse(comment.timestamp)
            : Date.now(),
        });
      }
    },
    async activate() {
      const webhook = await this.circleci.createWebhook({
        name: this.webhookName,
        events: [
          "comment-added",
        ],
        url: this.http.endpoint,
        verify_tls: this.verifyTls,
        signing_secret: this.signingSecret,
      });
      this._setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.circleci.deleteWebhook({
          webhookId,
        });
        this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-CircleCI-Signature"];
    const payload = event.body;

    if (!this._verifySignature(payload, signature)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (payload.type !== "comment-added") {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    if (!this._applyFilters(payload)) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }

    const id = payload.commentId || payload.id || Date.now().toString();
    const summary = `New comment added by ${payload.user} to ${payload.itemType}`;
    const ts = payload.timestamp
      ? Date.parse(payload.timestamp)
      : Date.now();

    this.$emit(payload, {
      id,
      summary,
      ts,
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
