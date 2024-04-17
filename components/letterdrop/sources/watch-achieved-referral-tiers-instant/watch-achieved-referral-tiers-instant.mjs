import letterdrop from "../../letterdrop.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letterdrop-watch-achieved-referral-tiers-instant",
  name: "Watch Achieved Referral Tiers",
  description: "Emits an event when a subscriber unlocks a new level in your referral tiers by making enough referrals on Letterdrop. [See the documentation](https://docs.letterdrop.com/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    letterdrop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
  },
  hooks: {
    async deploy() {
      const achievements = await this.letterdrop.listReferralTierAchievements();
      achievements.slice(-50).forEach((achievement) => {
        this.$emit(achievement, {
          id: achievement.id || `${achievement.tierName}-${achievement.achievedOn}`,
          summary: `New referral tier achieved: ${achievement.tierName}`,
          ts: Date.parse(achievement.achievedOn),
        });
      });
    },
  },
  async run() {
    const lastCheck = this.db.get("lastCheck") || Date.now();
    const newAchievements = await this.letterdrop.listReferralTierAchievements({
      since: lastCheck,
    });

    newAchievements.forEach((achievement) => {
      this.$emit(achievement, {
        id: achievement.id || `${achievement.tierName}-${achievement.achievedOn}`,
        summary: `New referral tier achieved: ${achievement.tierName}`,
        ts: Date.parse(achievement.achievedOn),
      });
    });

    this.db.set("lastCheck", Date.now());
  },
};
