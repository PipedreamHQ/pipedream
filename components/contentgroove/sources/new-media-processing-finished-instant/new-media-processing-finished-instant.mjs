import contentgroove from "../../contentgroove.app.mjs";

export default {
  key: "contentgroove-new-media-processing-finished-instant",
  name: "New Media Processing Finished (Instant)",
  description: "Emit new event when a media is done processing by ContentGroove.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    contentgroove,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    emitData(data) {
      this.$emit(data, {
        id: data.id,
        summary: `Media ${data.attributes.name} processed.`,
        ts: Date.parse(data.attributes.created_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const { data } = await this.contentgroove.listProcessedMedia({
        params: {
          size: 25,
          sort: "-createdAt",
        },
      });

      data.reverse()
        .forEach((mediaItem) => this.emitData(mediaItem));
    },
    async activate() {
      const response = await this.contentgroove.createWebhook({
        data: {
          data: {
            attributes: {
              url: this.http.endpoint,
              subscribed_events: [
                "media.processing_finished",
              ],
            },
          },
        },
      });
      this.db.set("webhookId", response.data?.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.contentgroove.deleteWebhook(webhookId);
    },
  },
  async run({ body }) {
    const { payload: { data } } = body;
    this.emitData(data);
  },
};
