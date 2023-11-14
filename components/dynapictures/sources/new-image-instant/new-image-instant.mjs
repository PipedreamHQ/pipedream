import { axios } from "@pipedream/platform";
import dynapictures from "../../dynapictures.app.mjs";

export default {
  key: "dynapictures-new-image-instant",
  name: "New Image Instant",
  description: "Emit new event when an image has been generated. [See the documentation](https://dynapictures.com/docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dynapictures,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  async run(event) {
    const { body } = event;
    const {
      id, templateId, imageUrl, thumbnailUrl, retinaThumbnailUrl, metadata, width, height,
    } = body;

    // Emit the event if it contains an ID and imageUrl indicating a new image generation
    if (id && imageUrl) {
      this.$emit(body, {
        id,
        summary: `New image generated with ID: ${id}`,
        ts: Date.now(),
      });
      this.http.respond({
        status: 200,
        body: "Event received",
      });
    } else {
      this.http.respond({
        status: 400,
        body: "This webhook is not for a new image generation event.",
      });
    }
  },
};
