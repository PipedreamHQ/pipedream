import common from "../common-polling.mjs";

export default {
  ...common,
  key: "twilio-new-phone-recording",
  name: "New Recording",
  description: "Emits an event when a new call recording is created",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(...args) {
      return await this.twilio.listRecordings(...args);
    },
    generateMeta(recording) {
      const {
        sid: id,
        dateCreated,
      } = recording;
      return {
        id,
        summary: `New recording ${id}`,
        ts: Date.parse(dateCreated),
      };
    },
  },
};
