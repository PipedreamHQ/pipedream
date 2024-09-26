import base from "../common/base.mjs";

export default {
  ...base,
  key: "signalwire-new-phone-call",
  name: "New Phone Call",
  description: "Emits an event when a new phone call has been logged",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.signalwire.listPhoneCallLogs;
    },
    generateMeta(call) {
      return {
        id: call.id,
        summary: `New phone call log: ${call.id}`,
        ts: Date.parse(call.created_at),
      };
    },
  },
};
