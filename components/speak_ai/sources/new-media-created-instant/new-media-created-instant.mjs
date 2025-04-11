import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-media-created-instant",
  name: "New Media Created (Instant)",
  description: "Emit new event when a new media file is created. Useful for initiating workflows based on new media intake. [See the documentation](https://docs.speakai.co/#5777a89c-a6c3-4d0e-aab1-d33fdec5cbe8).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.MEDIA_CREATED,
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
        id: resource.mediaId,
        summary: `New Media Created: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
