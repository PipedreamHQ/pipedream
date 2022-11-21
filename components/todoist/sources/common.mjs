import todoist from "../todoist.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    todoist,
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Todoist API on this schedule",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit no more than 20 items on first run
      const syncResult = await this.getSyncResult();
      const results = this.filterResults(syncResult).slice(0, 20);
      this.emitResults(results);
    },
  },
  methods: {
    generateMeta(element) {
      const {
        id: elementId,
        summary,
        date_completed: dateCompleted,
      } = element;
      const ts = Date.parse(dateCompleted);
      const id = `${elementId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
    filterResults(syncResult) {
      return Object.values(syncResult)
        .filter(Array.isArray)
        .flat();
    },
    getSyncResult() {
      throw new Error("getSyncResult is not implemented");
    },
    emitResults() {
      throw new Error("emitResults is not implemented");
    },
  },
  async run() {
    const syncResult = await this.getSyncResult();
    const results = this.filterResults(syncResult);
    this.emitResults(results);
  },
};
