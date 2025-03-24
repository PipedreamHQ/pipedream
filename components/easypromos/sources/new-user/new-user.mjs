import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "easypromos-new-user",
  name: "New User Registration",
  description: "Emit new event when a user registers in the promotion.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.easypromos.getUsers;
    },
    getOpts() {
      return {
        promotionId: this.promotionId,
      };
    },
    getSummary(user) {
      return `New User Registration: ${user.email}`;
    },
  },
  sampleEmit,
};
