import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pitchlane-new-video-first-viewed",
  name: "New Video First Viewed (Instant)",
  description: "Emit new event when a video is first viewed in Pitchlane. [See the documentation](https://docs.pitchlane.com/reference#tag/webhooks/POST/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "VIDEO_FIRST_VIEWED";
    },
    generateMeta(body) {
      return {
        id: body.video._id,
        summary: `New video first viewed with ID: ${body.video._id}`,
        ts: Date.parse(body.video.viewedAt),
      };
    },
  },
  sampleEmit,
};
