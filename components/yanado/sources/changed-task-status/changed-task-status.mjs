import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-changed-task-status",
  // eslint-disable-next-line pipedream/source-name
  name: "Changed Task Status",
  description: "Emit new event when a task status changes",
  version: "0.0.1",
  type: "source",
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
    statusId: {
      propDefinition: [
        yanado,
        "statusId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      description: "Only emit event if the status changed to this chosen value",
    },
  },
  methods: {
    _getTaskStatus(taskId) {
      return this.db.get(taskId);
    },
    _setTaskStatus(taskId, status) {
      this.db.set(taskId, status);
    },
    _hasTaskStatusChanged(taskId, status) {
      const taskStatus = this._getTaskStatus(taskId);
      return taskStatus !== status;
    },
  },
  async run() {
    const tasks = await this.yanado.findTasks({
      params: {
        listId: this.listId,
        statusId: this.statusId,
      },
    });

    for (const task of tasks) {
      const {
        taskId: id,
        name,
        statusId,
        statusName,
      } = task;

      if (this.statusId && statusId !== this.statusId) {
        continue;
      }

      if (this._hasTaskStatusChanged(id, statusId)) {
        this._setTaskStatus(id, statusId);
        this.$emit(task, {
          id,
          summary: `Status: ${statusName} - Task: ${name}`,
          ts: new Date(),
        });
      }
    }
  },
};
