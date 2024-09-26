import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "wrike-new-subtask-created",
  name: "New Subtask Created",
  description: "Emit new event when a subtask is created",
  type: "source",
  version: "0.0.1",
  props: {
    ...base.props,
    taskId: {
      propDefinition: [
        base.props.wrike,
        "taskId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
        }),
      ],
      description: "Receive notifications for subtasks of a task",
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving historical events...");
      const subtasks = await this.wrike.getSubtasks({
        taskId: this.taskId,
      });
      for (const subtask of subtasks.slice(-constants.DEPLOY_LIMIT)) {
        this.emitEvent(subtask);
      }
    },
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "TaskCreated",
      ];
    },
    async emitEvent(task) {
      this.$emit(task, {
        id: task.id,
        summary: `New task: ${task.title}`,
        ts: task.createdDate,
      });
    },
  },
  async run(event) {
    console.log("Webhook received");
    for (const data of event.body) {
      const task = await this.wrike.getTask({
        taskId: data.taskId,
      });
      if (task.superTaskIds.includes(this.taskId)) {
        this.emitEvent(task);
      }
    }
  },
};
