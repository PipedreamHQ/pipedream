import jobspipe from "../../jobspipe.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    jobspipe,
    db: "$.service.db",
    timer: {
      label: "Polling Interval",
      description: "Pipedream will poll the JobsPipe API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastJobIds() {
      return this.db.get("lastJobIds") || [];
    },
    _setLastJobIds(jobIds) {
      this.db.set("lastJobIds", jobIds);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
