import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pitchlane-new-video-rendered",
  name: "New Video Rendered (Instant)",
  description: "Emit new event when a video is rendered in Pitchlane. [See the documentation](https://docs.pitchlane.com/reference#tag/webhooks/POST/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getEventType() {
      return "VIDEO_RENDERED";
    },
    generateMeta(body) {
      return {
        id: body.video.id,
        summary: `New video rendered with ID: ${body.video.id}`,
        ts: Date.parse(body.video.renderedAt),
      };
    },
  },
  sampleEmit,
};
