import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ticktick-new-task-completed",
  name: "New Task Completed",
  description: "Emit new event when a task is completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousTaskIds() {
      return this.db.get("previousTaskIds") || [];
    },
    _setPreviousTaskIds(previousTaskIds) {
      this.db.set("previousTaskIds", previousTaskIds);
    },
    getSummary(task) {
      return `New Task Completed ID: ${task.id}`;
    },
  },
  async run() {
    const tasks = await this.ticktick.listTasks({
      projectId: this.projectId,
    });
    if (!tasks?.length) {
      return;
    }
    const previousTaskIds = this._getPreviousTaskIds();
    const currentTaskIds = tasks.map(({ id }) => id);
    const completedTaskIds = tasks.filter(({ completedTime }) => completedTime).map(({ id }) => id);
    for (const id of previousTaskIds) {
      if (!currentTaskIds.includes(id)) {
        completedTaskIds.push(id);
      }
    }
    for (const id of completedTaskIds) {
      const task = await this.ticktick.getTask({
        projectId: this.projectId,
        taskId: id,
      });
      const meta = this.generateMeta(task);
      this.$emit(task, meta);
    }
    const activeTaskIds = tasks.filter(({ completedTime }) => !completedTime).map(({ id }) => id);
    this._setPreviousTaskIds(activeTaskIds);
  },
  sampleEmit,
};
