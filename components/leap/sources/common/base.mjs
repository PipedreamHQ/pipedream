import leap from "../../leap.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    leap,
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
      await this.processHistoricalEvents({
        limit: 25,
      });
    },
  },
  methods: {
    _getPrevious() {
      return this.db.get("previous");
    },
    _setPrevious(previous) {
      this.db.set("previous", previous);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
