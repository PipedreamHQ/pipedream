import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-sentiment",
  name: "New Sentiment Analysis (Instant)",
  description: "Emit new event when Speak AI produces sentiment analysis for a media file (`media.analyzed`, `media.reanalyzed`). [See the documentation](https://docs.speakai.co/api/media/#get-media-insight-media-id).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.MEDIA_ANALYZED,
        events.MEDIA_REANALYZED,
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
        summary: `New Sentiment Analysis: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
