import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "easypromos-new-participation",
  name: "New Participation Submitted",
  description: "Emit new event when a registered user submits a participation in the promotion.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.easypromos.getParticipations;
    },
    getOpts() {
      return {
        promotionId: this.promotionId,
      };
    },
    getSummary(participation) {
      return `New Participation: ${participation.id}`;
    },
  },
  sampleEmit,
};
