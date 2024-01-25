import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "referrizer-new-loyalty-reward-redeemed",
  name: "New Loyalty Reward Redeemed",
  description: "Emit new event when a new loyalty reward has been redeemed by a contact.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(reward) {
      return {
        id: `${reward.loyaltyRewardId}-${Date.parse(reward.date)}`,
        summary: `Loyalty Reward Redeemed: ${reward.loyaltyRewardId}`,
        ts: Date.now(),
      };
    },
    getMethod() {
      return this.referrizer.listRedeemedLoyaltyRewards;
    },
  },
  sampleEmit,
};
