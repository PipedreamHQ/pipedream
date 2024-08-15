import heyzine from "../../heyzine.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "heyzine-new-flipbook",
  name: "New Flipbook Created",
  description: "Emits a new event when a new flipbook is created in your Heyzine account.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heyzine,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New Flipbook Created: ${id}`,
        ts: Date.parse(created_at),
      };
    },
  },
  hooks: {
    async deploy() {
      // Get the last 50 flipbooks
      const flipbooks = await this.heyzine.emitFlipbookCreatedEvent();
      for (const flipbook of flipbooks.slice(-50)) {
        const meta = this.generateMeta(flipbook);
        this.$emit(flipbook, meta);
      }
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.intervalSeconds;
    const now = new Date().toISOString();

    const flipbooks = await this.heyzine.emitFlipbookCreatedEvent();

    for (const flipbook of flipbooks) {
      if (new Date(flipbook.created_at) > new Date(lastRunTime)) {
        const meta = this.generateMeta(flipbook);
        this.$emit(flipbook, meta);
      }
    }

    this.db.set("lastRunTime", now);
  },
};
