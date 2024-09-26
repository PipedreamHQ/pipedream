import onstrategy from "../../onstrategy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "onstrategy-new-goal-added",
  name: "New Goal Added",
  description: "Emit new event when a new goal is created within the OnStrategy app. [See the documentation](https://developer.onstrategyhq.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    onstrategy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(goal) {
      return {
        id: goal.id,
        summary: `New Goal: ${goal.item}`,
        ts: Date.now(),
      };
    },
    async processEvent(limit) {
      const lastId = this._getLastId();
      let maxId = lastId;
      const { data } = await this.onstrategy.listGoals();
      const goals = limit
        ? data.slice(-1 * limit)
        : data;
      for (const goal of goals) {
        if (goal.id > lastId) {
          maxId = Math.max(goal.id, maxId);
          const meta = this.generateMeta(goal);
          this.$emit(goal, meta);
        }
      }
      this._setLastId(maxId);
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
