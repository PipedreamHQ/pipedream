import { axios } from "@pipedream/platform";
import onstrategy from "../../onstrategy.app.mjs";

export default {
  key: "onstrategy-new-goal",
  name: "New Goal Created",
  description: "Emits a new event when a new goal is created within the OnStrategy app.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    onstrategy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  async run() {
    const newGoal = await this.onstrategy.emitNewGoalEvent();
    this.$emit(newGoal, {
      id: newGoal.id,
      summary: `New Goal: ${newGoal.title}`,
      ts: Date.now(),
    });
  },
};
