import base from "../common/base.mjs";

export default {
  ...base,
  key: "waiverforever-new-waiver-signed",
  name: "New Waiver Signed (Instant)",
  description: "Emit new event when a new Waiver sign is received",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook("new_waiver_signed");
    },
  },
  methods: {
    ...base.methods,
    getSummary({ id }) {
      return `New Waiver Signed: ${id}`;
    },
  },
};
