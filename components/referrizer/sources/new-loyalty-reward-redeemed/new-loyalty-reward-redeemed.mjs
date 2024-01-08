import referrizer from "../../referrizer.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "referrizer-new-loyalty-reward-redeemed",
  name: "New Loyalty Reward Redeemed",
  description: "Emits an event when a new loyalty reward has been redeemed by a contact. [See the documentation](https://api.referrizer.com/static/docs/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    referrizer,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    loyaltyRewardId: {
      propDefinition: [
        referrizer,
        "loyaltyRewardId",
      ],
    },
    contactId: {
      propDefinition: [
        referrizer,
        "contactId",
      ],
    },
  },
  methods: {
    generateMeta(reward) {
      return {
        id: reward.id,
        summary: `Loyalty Reward Redeemed: ${reward.title}`,
        ts: Date.parse(reward.updated_at),
      };
    },
    emitEvents(rewards) {
      for (const reward of rewards) {
        const meta = this.generateMeta(reward);
        this.$emit(reward, meta);
      }
    },
  },
  hooks: {
    async deploy() {
      let page = 0;
      let emitted = 0;
      let hasMore = true;

      while (emitted < 50 && hasMore) {
        const {
          items: rewards, perPage,
        } = await this.referrizer.listLoyaltyRewards({
          page,
        });
        if (!rewards.length) {
          break;
        }
        const filteredRewards = rewards.filter((reward) => reward.redeemed);
        this.emitEvents(filteredRewards.slice(0, 50 - emitted));
        emitted += filteredRewards.length;
        hasMore = filteredRewards.length >= perPage;
        page++;
      }
    },
  },
  async run() {
    const lastEmittedId = this.db.get("lastEmittedId") || 0;
    let maxEmittedId = lastEmittedId;
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const {
        items: redeemedRewards, perPage,
      } = await this.referrizer.listLoyaltyRewards({
        page,
      });
      const newRewards = redeemedRewards.filter((reward) => reward.id > lastEmittedId && reward.redeemed);

      this.emitEvents(newRewards);

      if (newRewards.length) {
        maxEmittedId = Math.max(maxEmittedId, ...newRewards.map((reward) => reward.id));
      }

      hasMore = redeemedRewards.length === perPage;
      page++;
    }

    this.db.set("lastEmittedId", maxEmittedId);
  },
};
