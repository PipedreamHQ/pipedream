import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "timing-new-timer-started-running",
  name: "New Timer Started Running",
  description: "Emit new event each time a new timer is started",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastStartedTs() {
      return this.db.get("lastStartedTs") || 0;
    },
    _setLastStartedTs(lastStartedTs) {
      this.db.set("lastStartedTs", lastStartedTs);
    },
    generateMeta(timeEntry) {
      const startTime = Date.parse(timeEntry.start_date);
      return {
        id: `${timeEntry.self}-${startTime}`,
        summary: `Timer started: ${timeEntry.title || timeEntry.self}`,
        ts: startTime,
      };
    },
  },
  async run() {
    const lastStartedTs = this._getLastStartedTs();
    let maxTs = lastStartedTs;
    const timeEntries = await this.getPaginatedTimeEntries();
    const newlyStarted = timeEntries
      .filter(({ start_date: startDate }) => Date.parse(startDate) >= lastStartedTs);
    for (const timeEntry of newlyStarted) {
      maxTs = Math.max(Date.parse(timeEntry.start_date), maxTs);
      const meta = this.generateMeta(timeEntry);
      this.$emit(timeEntry, meta);
    }
    this._setLastStartedTs(maxTs);
  },
  sampleEmit,
};
