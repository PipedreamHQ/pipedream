import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pitchlane-new-video-created",
  name: "New Video Created (Instant)",
  description: "Emit new event when a video is created in Pitchlane. [See the documentation](https://docs.pitchlane.com/reference#tag/webhooks/POST/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "VIDEO_CREATED";
    },
    generateMeta(body) {
      return {
        id: body.video.id,
        summary: `New video created with ID: ${body.video.id}`,
        ts: Date.parse(body.video.createdAt),
      };
    },
  },
  sampleEmit,
};
