import toneden from "../../toneden.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "toneden-new-contest-created-instant",
  name: "New Contest Created (Instant)",
  description: "Emits an event when a new contest is created. [See the documentation](https://developers.toneden.io/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    toneden,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    userId: {
      propDefinition: [
        toneden,
        "userId",
      ],
    },
  },
  methods: {
    ...toneden.methods,
    async getSortedContests(userId, status) {
      const results = await this.toneden.paginate(this.toneden.getUserAdCampaigns, userId, status);
      return results
        .filter((campaign) => campaign.type === "contest")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    async emitContests(contests) {
      for (const contest of contests) {
        this.$emit(contest, {
          id: contest.id,
          summary: `New Contest: ${contest.name}`,
          ts: Date.parse(contest.created_at),
        });
      }
    },
    getLastContestTimestamp() {
      return this.db.get("lastContestTimestamp") || new Date(0).toISOString();
    },
    setLastContestTimestamp(timestamp) {
      this.db.set("lastContestTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const sortedContests = await this.getSortedContests(this.userId, "active");
      const latestContests = sortedContests.slice(0, 50);
      await this.emitContests(latestContests);
      if (latestContests.length > 0) {
        this.setLastContestTimestamp(latestContests[0].created_at);
      }
    },
  },
  async run() {
    const lastContestTimestamp = this.getLastContestTimestamp();
    const sortedContests = await this.getSortedContests(this.userId, "active");
    const newContests = sortedContests.filter((contest) => new Date(contest.created_at) > new Date(lastContestTimestamp));
    await this.emitContests(newContests);
    if (newContests.length > 0) {
      this.setLastContestTimestamp(newContests[0].created_at);
    }
  },
};
