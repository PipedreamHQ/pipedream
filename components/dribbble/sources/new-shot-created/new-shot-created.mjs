import dribbble from "../../dribbble.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "dribbble-new-shot-created",
  name: "New Shot Created",
  description: "Emit new events when new shots are created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    dribbble,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Dribble API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const shots = await this.dribbble.getShots();

    for (const shot of shots) {
      this.$emit(shot, {
        id: shot.id,
        summary: shot.title,
        ts: Date.parse(shot.published_at),
      });
    }
  },
};
