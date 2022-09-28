import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Task",
  key: "yanado-new-task",
  description: "Emit new event for every new task in  a list",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    _getTasks() {
      const tasks = this.db.get("tasks") || [];
      return new Set(tasks);
    },
    _setTasks(tasks) {
      this.db.set("tasks", Array.from(tasks));
    },
  },
  async run() {
    const savedTasks = this._getTasks();
    const tasks = await this.yanado.findTasks({
      listId: this.listId,
    });

    tasks
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .forEach((task) => {
        const {
          taskId: id,
          createTime: ts,
          name,
        } = task;

        if (!savedTasks.has(id)) {
          savedTasks.add(id);
          this.$emit(task, {
            id,
            summary: `New task: ${name}`,
            ts,
          });
        }
      });

    this._setTasks(savedTasks);
  },
};
