import frameio from "../../frameio.app.mjs";

export default {
  key: "frameio-new-comment-instant",
  name: "New Comment Instant",
  description: "Emit new event when a new comment is left on an asset",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    frameio,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    assetId: {
      propDefinition: [
        frameio,
        "assetId",
      ],
    },
    commentId: {
      propDefinition: [
        frameio,
        "commentId",
      ],
    },
  },
  hooks: {
    async activate() {
      // Placeholder for webhook subscription logic if required
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic if required
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      this.http.respond({
        status: 400,
        body: "No data received",
      });
      return;
    }

    // Assuming the incoming webhook structure contains the asset ID and comment ID
    if (body.asset_id !== this.assetId || body.comment_id !== this.commentId) {
      this.http.respond({
        status: 404,
        body: "Not found",
      });
      return;
    }

    this.$emit(body, {
      id: body.comment_id,
      summary: `New comment on asset ${body.asset_id}: ${body.text}`, // Assuming `text` is the property for the comment text in the incoming webhook payload
      ts: Date.parse(body.timestamp) || +new Date(),
    });

    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
