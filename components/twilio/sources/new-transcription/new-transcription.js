const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "twilio-new-transcription",
  name: "New Transcription",
  description: "Emits an event when a new call transcription is created",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(...args) {
      return await this.twilio.listTranscriptions(...args);
    },
    generateMeta(transcription) {
      const { sid: id, dateCreated } = transcription;
      return {
        id,
        summary: `New transcription ${id}`,
        ts: Date.parse(dateCreated),
      };
    },
  },
};