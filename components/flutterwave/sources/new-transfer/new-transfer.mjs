import base from "../common/base.mjs";

export default {
  ...base,
  key: "flutterwave-new-transfer",
  name: "New Transfer",
  description: "Emit new event whenever a new transfer event occurs.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.flutterwave.getTransfers;
    },
    getParams(lastTs) {
      return lastTs
        ? {
          from: this.formatDate(lastTs),
        }
        : {};
    },
    generateMeta(transfer) {
      return {
        id: transfer.id,
        summary: `New transfer: ${transfer.id}`,
        ts: Date.parse(transfer.created_at),
      };
    },
  },
};
