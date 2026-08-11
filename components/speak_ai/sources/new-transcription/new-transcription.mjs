import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-transcription",
  name: "New Automated Transcription (Instant)",
  description: "Emit new event when Speak AI finishes transcribing a media file (`media.analyzed`, `media.reanalyzed`). [See the documentation](https://docs.speakai.co/api/media/#get-media-transcript-media-id).",
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
      const { data } = await this.app.getTranscript({
        mediaId: resource.mediaId,
      });
      return data;
    },
    generateMeta(resource, data) {
      return {
        id: this.getEventId(resource),
        summary: `New Transcription: ${resource.mediaId}`,
        ts: this.getEventTs(data),
      };
    },
  },
  sampleEmit,
};
