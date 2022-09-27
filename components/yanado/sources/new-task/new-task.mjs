import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-new-task",
  name: "New Task",
  description: "Emit new event for every new task",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    yanado,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    listId: {
      propDefinition: [
        yanado,
        "listId",
      ],
    },
  },
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

    for (const task of tasks) {
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
    }

    this._setTasks(savedTasks);
  },
};
