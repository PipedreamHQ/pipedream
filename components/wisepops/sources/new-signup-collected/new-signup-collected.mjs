import base from "../common/base.mjs";

export default {
  ...base,
  key: "wisepops-new-signup-collected",
  name: "New Sign-Up Collected (Instant)",
  description: "Emit new event when a new sign-up is received",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook("email");
    },
  },
  methods: {
    ...base.methods,
    getSummary({
      fields, wisepop_id,
    }) {
      return `New sign-up: ${fields?.email ?? wisepop_id}`;
    },
  },
};
