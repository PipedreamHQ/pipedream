import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "wrike-new-subtask-created",
  name: "New Subtask Created",
  description: "Emit new event when a subtask is created",
  type: "source",
  version: "0.0.2",
  props: {
    ...base.props,
    taskIds: {
      propDefinition: [
        base.props.wrike,
        "taskId",
      ],
      type: "string[]",
      label: "Task IDs",
      description: "Receive notifications for subtasks of the specified task(s)",
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving historical events...");
      const taskIds = this.taskIds || (await this.wrike.listTasks({}))?.map(({ id }) => id) || [];
      const subtasks = [];
      for (const taskId of taskIds) {
        const taskSubtasks = await this.wrike.getSubtasks({
          taskId,
        });
        subtasks.push(...taskSubtasks);
      }
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
      if (!this.taskIds || task.superTaskIds.some((id) => this.taskIds.includes(id))) {
        this.emitEvent(task);
      }
    }
  },
};
