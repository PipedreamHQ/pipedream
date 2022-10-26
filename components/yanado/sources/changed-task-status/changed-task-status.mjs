import common from "../common/base.mjs";

export default {
  // eslint-disable-next-line pipedream/source-name
  name: "Changed Task Status",
  key: "yanado-changed-task-status",
  description: "Emit new event when a task status changes",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    statusId: {
      propDefinition: [
        common.props.yanado,
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
