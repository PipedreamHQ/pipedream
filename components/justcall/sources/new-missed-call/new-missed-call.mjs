import common from "../common/base.mjs";

export default {
  ...common,
  key: "justcall-new-missed-call",
  name: "New Missed Call (Instant)",
  description: "Emit new event when a call is missed.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTopicId() {
      return 1;
    },
    generateMeta(data) {
      if (data.call_status != "no-answer") return false;

      const {
        callid, datetime,
      } = data;
      return {
        id: callid,
        summary: `New missed call with id: ${callid}!`,
        ts: Date.parse(datetime),
      };
    },
  },
};
