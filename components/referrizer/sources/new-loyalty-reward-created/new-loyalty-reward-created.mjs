import referrizer from "../../referrizer.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "referrizer-new-loyalty-reward-created",
  name: "New Loyalty Reward Created",
  description: "Emits an event when a new loyalty reward has been created in Referrizer. [See the documentation](https://api.referrizer.com/static/docs/index.html)",
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
    _getCursor() {
      return this.db.get("cursor") || null;
    },
    _setCursor(cursor) {
      this.db.set("cursor", cursor);
    },
    _isCursorValid(cursor) {
      return cursor && !isNaN(Date.parse(cursor));
    },
    _toTimestamp(dateString) {
      return new Date(dateString).getTime();
    },
  },
  hooks: {
    async deploy() {
      const { items } = await this.referrizer.listLoyaltyRewards({
        page: 0,
      });
      if (items && items.length) {
        const mostRecentItem = items[0];
        const cursor = mostRecentItem.created_at;
        this._setCursor(cursor);
        const recentRewards = items.slice(0, 50).reverse();
        for (const reward of recentRewards) {
          this.$emit(reward, {
            id: reward.id,
            summary: `New Loyalty Reward: ${reward.title}`,
            ts: this._toTimestamp(reward.created_at),
          });
        }
      }
    },
  },
  async run() {
    const cursor = this._getCursor();
    let nextPage = 0;
    let hasMore = true;
    let maxTimestamp = null;

    while (hasMore) {
      const { items } = await this.referrizer.listLoyaltyRewards({
        page: nextPage,
      });

      for (const reward of items) {
        const rewardTimestamp = this._toTimestamp(reward.created_at);

        if (this._isCursorValid(cursor) && rewardTimestamp <= this._toTimestamp(cursor)) {
          hasMore = false;
          break;
        }

        this.$emit(reward, {
          id: reward.id,
          summary: `New Loyalty Reward: ${reward.title}`,
          ts: rewardTimestamp,
        });

        if (!maxTimestamp || rewardTimestamp > maxTimestamp) {
          maxTimestamp = rewardTimestamp;
        }
      }

      if (items.length === 0 || !hasMore) {
        break;
      }

      nextPage++;
    }

    if (maxTimestamp) {
      this._setCursor(new Date(maxTimestamp).toISOString());
    }
  },
};
