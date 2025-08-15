import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sevdesk-new-voucher",
  name: "New Voucher Created",
  description: "Emit new event when a new voucher is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.sevdesk.listVouchers;
    },
    getSummary(data) {
      return `New voucher created with Id: ${data.id}`;
    },
  },
  sampleEmit,
};
