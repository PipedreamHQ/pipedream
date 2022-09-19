import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-new-task-due",
  name: "New Task Due (Instant)",
  description: "Emit new event when a new task is created in a pipeline.",
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
        const pastDueTasks = results.filter((task) => task?.reminderStatus === "REMINDED");
        tasks.push(...pastDueTasks);
        if (tasks.length >= limit) {
          tasks.length = limit;
          break;
        }
      }
      return tasks;
    },
    getEventType() {
      return "TASK_DUE";
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
