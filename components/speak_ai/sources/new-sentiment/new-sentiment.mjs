import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-sentiment",
  name: "New Sentiment Analysis (Instant)",
  description: "Emit new event when Speak AI produces sentiment analysis for a media file (`media.analyzed`, `media.reanalyzed`). [See the documentation](https://docs.speakai.co/).",
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
    getSummary(resource) {
      return `New sentiment analysis for media ${resource.mediaId}`;
    },
    async hydrate(resource) {
      const results = await this.app.getInsights({
        params: {
          insightType: "sentiment",
          mediaId: resource.mediaId,
          pageSize: 1,
        },
      });
      return this.app.firstResult(results, resource);
    },
  },
  sampleEmit,
};
