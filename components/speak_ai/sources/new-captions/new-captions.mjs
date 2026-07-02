import common from "../common/base.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-captions",
  name: "New Captions (Instant)",
  description: "Emit new event with caption files (SRT or VTT) when Speak AI finishes analyzing a media file (`media.analyzed`, `media.reanalyzed`). [See the documentation](https://docs.speakai.co/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fileType: {
      type: "string",
      label: "Caption File Type",
      description: "The caption format to fetch",
      options: [
        "SRT",
        "VTT",
      ],
      default: "SRT",
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.MEDIA_ANALYZED,
        events.MEDIA_REANALYZED,
      ];
    },
    getSummary(resource) {
      return `New ${this.fileType} captions for media ${resource.mediaId}`;
    },
    async hydrate(resource) {
      const results = await this.app.getExport({
        headers: {
          Accept: "application/json",
        },
        params: {
          mediaId: resource.mediaId,
          fileType: this.fileType.toLowerCase(),
        },
      });
      return this.app.firstResult(results, resource);
    },
  },
  sampleEmit,
};
