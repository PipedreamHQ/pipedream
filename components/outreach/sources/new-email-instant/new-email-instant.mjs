import common from "../common/base.mjs";

export default {
  ...common,
  key: "outreach-new-email-instant",
  name: "New Email Event (Instant)",
  description: "Emit new event when an email is created, updated, destroyed, bounced, delivered, opened or replied.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResource() {
      return "mailing";
    },
  },
};
