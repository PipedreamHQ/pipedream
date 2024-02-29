import contentgroove from "../../contentgroove.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "contentgroove-new-media-processing-finished-instant",
  name: "New Media Processing Finished",
  description: "Emit new event when a media is done processing by ContentGroove. [See the documentation](https://developers.contentgroove.com/api_reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentgroove: {
      type: "app",
      app: "contentgroove",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent processed media items as historical data
      const mediaItems = await this.contentgroove.paginate(this.contentgroove.listProcessedMedia);
      mediaItems.slice(-50).reverse()
        .forEach((mediaItem) => {
          this.$emit(mediaItem, {
            id: mediaItem.id,
            summary: `Media ${mediaItem.id} processed`,
            ts: Date.parse(mediaItem.processedAt),
          });
        });
    },
    async activate() {
      // Example: Create a webhook subscription if the API supports it
      // This is a placeholder. Actual implementation may vary based on the API.
      // const webhookId = await this.contentgroove.createWebhook({ url: this.http.endpoint });
      // this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Example: Delete the webhook subscription if the API supports it
      // This is a placeholder. Actual implementation may vary based on the API.
      // const webhookId = this.db.get("webhookId");
      // await this.contentgroove.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    // Assuming the event body contains the processed media information
    const media = event.body;
    // Emit each processed media item if it's an array, otherwise check the status
    if (media && Array.isArray(media)) {
      media.forEach((mediaItem) => {
        this.$emit(mediaItem, {
          id: mediaItem.id,
          summary: `Media ${mediaItem.id} processed`,
          ts: Date.parse(mediaItem.processedAt),
        });
      });
    } else if (media && media.mediaId) {
      const mediaInfo = await this.contentgroove.checkMediaStatus(media.mediaId);
      if (mediaInfo.status === "processed") {
        this.$emit(mediaInfo, {
          id: mediaInfo.id,
          summary: `Media ${mediaInfo.id} processed`,
          ts: Date.parse(mediaInfo.processedAt),
        });
      }
    }
    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
