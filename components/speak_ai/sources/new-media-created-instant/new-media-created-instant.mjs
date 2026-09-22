import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-media-created-instant",
  name: "New Media Created (Instant)",
  description: "Emit new event when a new media file is created. Useful for initiating workflows based on new media intake. [See the documentation](https://docs.speakai.co/api/webhooks/#post-webhook).",
  version: "0.0.2",
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
    generateMeta(resource, data) {
      return {
        id: this.getEventId(resource),
        summary: `New Media Created: ${resource.mediaId}`,
        ts: this.getEventTs(data),
      };
    },
  },
  sampleEmit,
};
