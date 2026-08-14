import common from "../common/common.mjs";
import { DEFAULT_HISTORICAL_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "wealthbox-task-completed-1",
  name: "Task Completed",
  description: "Emit new event each time a task transitions to complete. Polls GET /tasks including completed tasks, tracks by `updated_at`, and post-filters to tasks whose `complete` is true. On deploy it backfills up to 25 recently completed tasks. [See the documentation](https://dev.wealthbox.com/#tasks-retrieve-all-tasks-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const historicalEvents = await this.getEvents({
        params: {
          per_page: DEFAULT_HISTORICAL_LIMIT,
        },
      });
      if (!(historicalEvents?.length > 0)) {
        return;
      }
      let maxTs = 0;
      historicalEvents.forEach((event) => {
        this.emitEvent(event);
        const ts = this.getCreatedAtTs(event);
        if (ts > maxTs) {
          maxTs = ts;
        }
      });
      this._setLastCreated(maxTs);
    },
  },
  methods: {
    ...common.methods,
    getCreatedAtTs(event) {
      return Date.parse(event.updated_at) / 1000;
    },
    async getEvents({ params }) {
      const { tasks } = await this.wealthbox.listTasks({
        params: {
          ...params,
          completed: true,
        },
      });
      return (tasks || []).filter((t) => t.complete === true);
    },
    generateMeta(task) {
      return {
        id: `${task.id}-${task.updated_at}`,
        summary: `Task Completed: ${task.name}`,
        ts: this.getCreatedAtTs(task),
      };
    },
  },
  async run() {
    await this.processEvent(false);
  },
};
