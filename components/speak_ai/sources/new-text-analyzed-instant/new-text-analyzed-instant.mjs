import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "speak_ai-new-text-analyzed-instant",
  name: "New Text Analyzed (Instant)",
  description: "Emit new event when a new text is analyzed. Useful for initiating workflows based on new text analysis. [See the documentation](https://docs.speakai.co/api/webhooks/#post-webhook).",
  version: "0.0.2",
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
        id: this.getEventId(resource),
        summary: `New Text Analyzed: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
};
