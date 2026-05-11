import gettyImages from "../../getty_images.app.mjs";

export default {
  key: "getty_images-new-download-instant",
  name: "New Download (Instant)",
  description: "Emit new event when an image is downloaded from the user's Getty Images account. Configure your Getty Images account to send webhook events to this source's URL. Useful for tracking image usage and triggering automation on downloads.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gettyImages,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    generateMeta(body) {
      const assetId = body.asset_id ?? body.id;
      return {
        id: body.download_id ?? assetId,
        summary: assetId
          ? `Image downloaded: ${assetId}`
          : "Image downloaded",
        ts: body.downloaded_at
          ? Date.parse(body.downloaded_at)
          : Date.now(),
      };
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
