import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-task-completed",
  name: "Task Completed (Instant)",
  description: "Emit new event when a task is completed in a pipeline.",
  version: "0.0.1",
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
        const completedTasks = results.filter((task) => task?.status === "DONE");
        tasks.push(...completedTasks);
        if (tasks.length >= limit) {
          tasks.length = limit;
          break;
        }
      }
      return tasks;
    },
    getEventType() {
      return "TASK_COMPLETE";
    },
    generateMeta(task) {
      return {
        id: this.shortenKey(task.key),
        summary: task.text,
        ts: task.lastStatusChangeDate,
      };
    },
  },
};
