import outscraper from "../../outscraper.app.mjs";

export default {
  key: "outscraper-new-task-finished",
  name: "New Task Finished",
  description: "Emit new event when a task is finished on Outscraper.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    outscraper,
    db: "$.service.db",
    taskId: {
      propDefinition: [
        outscraper,
        "taskId",
      ],
    },
    timeInterval: {
      propDefinition: [
        outscraper,
        "timeInterval",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // On deploy, check the task status immediately
      await this.checkTask();
    },
  },
  methods: {
    async checkTask() {
      const taskId = this.taskId;
      const timeInterval = this.timeInterval || 60; // Use the provided time interval or default to 60 seconds
      let taskStatus = await this.outscraper.checkTaskStatus({
        taskId,
        timeInterval,
      });

      // Assuming taskStatus object contains a status field that indicates if the task is finished
      if (taskStatus.status === "finished") {
        this.$emit(taskStatus, {
          id: taskId,
          summary: `Task ${taskId} finished`,
          ts: Date.now(),
        });
      }
    },
  },
  async run() {
    await this.checkTask();
  },
};
