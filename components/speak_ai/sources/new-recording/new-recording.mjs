import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-recording",
  name: "New Recording Captured (Instant)",
  description: "Emit new event when a recording is captured through a Speak AI embed recorder (`embed_recorder.recording_received`). [See the documentation](https://docs.speakai.co/api/media/#get-media-insight-media-id).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.EMBED_RECORDER_RECORDING_RECEIVED,
      ];
    },
    async getData(resource) {
      const { data } = await this.app.getInsight({
        mediaId: resource.mediaId,
      });
      return data;
    },
    generateMeta(resource) {
      return {
        id: this.getEventId(resource),
        summary: `New Recording Captured: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
