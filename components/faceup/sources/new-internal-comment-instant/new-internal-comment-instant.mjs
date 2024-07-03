import faceup from "../../faceup.app.mjs";

export default {
  key: "faceup-new-internal-comment-instant",
  name: "New Internal Comment Instant",
  description: "Emit new event when a new internal comment is created. [See the documentation](https://support.faceup.com/en/article/internal-comments)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    faceup: {
      type: "app",
      app: "faceup",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    commentId: {
      propDefinition: [
        faceup,
        "commentId",
      ],
    },
    authorId: {
      propDefinition: [
        faceup,
        "authorId",
      ],
    },
  },
  hooks: {
    async activate() {
      const webhookId = await this.faceup.createInternalComment(this.commentId, this.authorId);
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.faceup.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 400,
        body: "Invalid content type",
      });
      return;
    }

    if (!body || !body.comment_id || !body.author_id) {
      this.http.respond({
        status: 400,
        body: "Required fields are missing",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: body.comment_id,
      summary: `New internal comment created by ${body.author_id}`,
      ts: Date.now(),
    });
  },
};
