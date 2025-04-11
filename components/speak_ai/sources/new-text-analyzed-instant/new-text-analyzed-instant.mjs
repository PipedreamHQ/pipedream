import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "speak_ai-new-text-analyzed-instant",
  name: "New Text Analyzed (Instant)",
  description: "Emit new event when a new text is analyzed. Useful for initiating workflows based on new text analysis. [See the documentation](https://docs.speakai.co/#5777a89c-a6c3-4d0e-aab1-d33fdec5cbe8).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.TEXT_ANALYZED,
        events.TEXT_REANALYZED,
      ];
    },
    async getData(resource) {
      const { data } = await this.app.getTextInsight({
        mediaId: resource.mediaId,
      });
      return data;
    },
    generateMeta(resource) {
      return {
        id: resource.mediaId,
        summary: `New Text Analyzed: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
};
