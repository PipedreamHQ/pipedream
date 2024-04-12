import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "timing-new-time-entry",
  name: "New Time Entry",
  description: "Emit new event each time a new time entry is created in Timing",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(timeEntry) {
      return {
        id: timeEntry.self,
        summary: `New Time Entry: ${timeEntry.title || timeEntry.self}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const timeEntries = await this.getPaginatedTimeEntries();
    for (const timeEntry of timeEntries) {
      const meta = this.generateMeta(timeEntry);
      this.$emit(timeEntry, meta);
    }
  },
  sampleEmit,
};
