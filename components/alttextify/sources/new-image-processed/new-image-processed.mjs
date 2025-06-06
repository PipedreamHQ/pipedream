import { axios } from "@pipedream/platform";
import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-new-image-processed",
  name: "New Image Processed by AltTextify",
  description: "Emit a new event when an image has been processed by AltTextify and alt text is generated. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    alttextify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    imageSubmissionId: {
      propDefinition: [
        alttextify,
        "imageSubmissionId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.checkForNewImageProcessing();
    },
    async activate() {
      // If needed, set up a webhook or similar mechanism here
    },
    async deactivate() {
      // If needed, remove a webhook or similar mechanism here
    },
  },
  methods: {
    getLastProcessedTimestamp() {
      return this.db.get("lastProcessedTimestamp") || 0;
    },
    setLastProcessedTimestamp(timestamp) {
      this.db.set("lastProcessedTimestamp", timestamp);
    },
    isAlreadyProcessed(imageData) {
      const lastProcessedTimestamp = this.getLastProcessedTimestamp();
      const imageTimestamp = new Date(imageData.created_at).getTime();
      return imageTimestamp <= lastProcessedTimestamp;
    },
    async checkForNewImageProcessing() {
      const imageData = await this.alttextify.retrieveAltTextByJobId({
        jobId: this.imageSubmissionId,
      });

      if (!this.isAlreadyProcessed(imageData)) {
        this.$emit(imageData, {
          id: imageData.asset_id,
          summary: `Processed Image: ${imageData.asset_id}`,
          ts: new Date(imageData.created_at).getTime(),
        });
        this.setLastProcessedTimestamp(new Date(imageData.created_at).getTime());
      }
    },
  },
  async run() {
    await this.checkForNewImageProcessing();
  },
};
