import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "twilio-new-recording",
  name: "New Recording",
  description: "Emit new event when a new call recording is created",
  version: "0.1.5",
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
