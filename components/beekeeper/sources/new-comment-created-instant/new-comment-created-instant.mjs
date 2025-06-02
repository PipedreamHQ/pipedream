import beekeeper from "../../beekeeper.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "beekeeper-new-comment-created-instant",
  name: "New Comment Created Event",
  description: "Emit new event when a new comment is created. [See the documentation](https://beekeeper.stoplight.io/docs/beekeeper-api/1ba495ce70084-register-a-new-webhook)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    beekeeper,
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
      const comments = await this.beekeeper._makeRequest({
        path: "/api/v1/comments",
        params: {
          limit: 50,
        },
      });
      comments.forEach((comment) => {
        this.$emit(comment, {
          id: comment.id,
          summary: `New comment by ${comment.user.display_name}`,
          ts: Date.parse(comment.created_at),
        });
      });
    },
    async activate() {
      const response = await this.beekeeper._makeRequest({
        method: "POST",
        path: "/api/v1/webhooks",
        data: {
          event_type: "posts.comment.created",
          url: this.http.endpoint,
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.beekeeper._makeRequest({
          method: "DELETE",
          path: `/api/v1/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const secretKey = this.beekeeper.$auth.api_key;
    const rawBody = event.bodyRaw;
    const webhookSignature = event.headers["x-webhook-signature"];

    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawBody)
      .digest("hex");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const { body } = event;
    this.$emit(body, {
      id: body.comment_id,
      summary: `New comment on post ${body.post_id}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
