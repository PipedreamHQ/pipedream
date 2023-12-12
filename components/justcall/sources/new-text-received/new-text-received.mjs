import common from "../common/base.mjs";

export default {
  ...common,
  key: "justcall-new-text-received",
  name: "New Text Received (Instant)",
  description: "Emit new event when a new text message is received.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTopicId() {
      return 2;
    },
    generateMeta(data) {
      if (data.delivery_status != "received") return false;

      const {
        messageid, datetime,
      } = data;
      return {
        id: messageid,
        summary: `New message with id: ${messageid} was received!`,
        ts: Date.parse(datetime),
      };
    },
  },
};
