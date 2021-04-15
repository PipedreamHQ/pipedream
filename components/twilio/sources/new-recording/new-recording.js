const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "twilio-new-phone-recording",
  name: "New Recording",
  description: "Emits an event when a new call recording is created",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(...args) {
      return await this.twilio.listRecordings(...args);
    },
    generateMeta(recording) {
      const { sid: id, dateCreated } = recording;
      return {
        id,
        summary: `New recording ${id}`,
        ts: Date.parse(dateCreated),
      };
    },
  },
};