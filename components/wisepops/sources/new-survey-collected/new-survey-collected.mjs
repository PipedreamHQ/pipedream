import base from "../common/base.mjs";

export default {
  ...base,
  key: "wisepops-new-survey-collected",
  name: "New Survey Collected (Instant)",
  description: "Emit new event when a new survey is received",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook("survey");
    },
  },
  methods: {
    ...base.methods,
    getSummary({ collected_at }) {
      return `New survey: ${collected_at}`;
    },
  },
};
