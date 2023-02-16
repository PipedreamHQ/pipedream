import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-new-task",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created in a pipeline.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const boxes = await this.streak.listBoxes({
        pipelineId: this.pipelineId,
        params: {
          limit,
          sortBy: "lastUpdatedTimestamp",
        },
      });
      const tasks = [];
      for (const box of boxes) {
        const { results } = await this.streak.listTasks({
          boxId: box.key,
        });
        tasks.push(...results);
        if (tasks.length >= limit) {
          tasks.length = limit;
          break;
        }
      }
      return tasks;
    },
    getEventType() {
      return "TASK_CREATE";
    },
    generateMeta(task) {
      return {
        id: this.shortenKey(task.key),
        summary: task.text,
        ts: task.creationDate,
      };
    },
  },
};
