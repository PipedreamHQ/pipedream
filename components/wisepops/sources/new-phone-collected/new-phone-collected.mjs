import base from "../common/base.mjs";

export default {
  ...base,
  key: "wisepops-new-phone-collected",
  name: "New Phone Collected (Instant)",
  description: "Emit new event when a new phone is received",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook("phone");
    },
  },
  methods: {
    ...base.methods,
    getSummary({
      fields, wisepop_id,
    }) {
      return `New phone: ${fields?.phone ?? wisepop_id}`;
    },
  },
};
