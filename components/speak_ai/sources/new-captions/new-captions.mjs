import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "speak_ai-new-captions",
  name: "New Captions (Instant)",
  description: "Emit new event with the caption file (SRT or VTT) when Speak AI finishes analyzing a media file (`media.analyzed`, `media.reanalyzed`). [See the documentation](https://docs.speakai.co/api/exports/#post-media-export-media-id-file-type).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fileType: {
      type: "string",
      label: "Caption File Type",
      description: "The caption format to export",
      options: constants.CAPTION_FILE_TYPES,
      default: "srt",
    },
    isSpeakerNames: {
      type: "boolean",
      label: "Include Speaker Names",
      description: "Label each caption with the name of the speaker",
      optional: true,
    },
    isTimeStamps: {
      type: "boolean",
      label: "Include Timestamps",
      description: "Include timestamps in the exported captions",
      optional: true,
    },
    isRedacted: {
      type: "boolean",
      label: "Redacted",
      description: "Export the redacted version of the captions",
      optional: true,
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
    getData(resource) {
      const {
        app,
        fileType,
        isSpeakerNames,
        isTimeStamps,
        isRedacted,
      } = this;

      return app.exportMedia({
        mediaId: resource.mediaId,
        fileType,
        params: {
          isSpeakerNames,
          isTimeStamps,
          isRedacted,
        },
      });
    },
    generateMeta(resource) {
      return {
        id: this.getEventId(resource),
        summary: `New Captions: ${resource.mediaId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
