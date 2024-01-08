import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "referrizer-new-loyalty-reward-created",
  name: "New Loyalty Reward Created",
  description: "Emit new event when a new loyalty reward has been created in Referrizer.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(reward) {
      return {
        id: reward.id,
        summary: `New Loyalty Reward: ${reward.title}`,
        ts: Date.now(),
      };
    },
    getMethod() {
      return this.referrizer.listLoyaltyRewards;
    },
  },
  sampleEmit,
};
