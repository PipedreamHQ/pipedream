import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-new-user-created",
  name: "New User Created (Instant)",
  description: "Emit new event when a new user has been created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "user.created";
    },
    generateMeta() {

    },
  },
};
