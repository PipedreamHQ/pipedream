import common from "../common-polling.mjs";

export default {
  ...common,
  key: "twilio-new-transcription",
  name: "New Transcription",
  description: "Emit new event when a new call transcription is created",
  version: "0.1.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(...args) {
      return await this.twilio.listTranscriptions(...args);
    },
    generateMeta(transcription) {
      const {
        sid: id,
        dateCreated,
      } = transcription;
      return {
        id,
        summary: `New transcription ${id}`,
        ts: Date.parse(dateCreated),
      };
    },
  },
};
