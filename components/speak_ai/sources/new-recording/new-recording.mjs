import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-recording",
  name: "New Recording Captured (Instant)",
  description: "Emit new event when a recording is captured through a Speak AI embed recorder (`embed_recorder.recording_received`). [See the documentation](https://docs.speakai.co/).",
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
    getSummary(resource) {
      return `New recording captured for media ${resource.mediaId}`;
    },
    async hydrate(resource) {
      const results = await this.app.getInsights({
        params: {
          uploadType: "recorder",
          mediaId: resource.mediaId,
          page: 0,
          pageSize: 1,
        },
      });
      const media = Array.isArray(results)
        ? results[0]
        : results;
      return media || resource;
    },
  },
  sampleEmit,
};
