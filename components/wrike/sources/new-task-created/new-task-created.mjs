import base from "../common/webhooks.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "wrike-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a task is created",
  type: "source",
  version: "0.0.1",
  props: {
    ...base.props,
    folderId: {
      propDefinition: [
        base.props.wrike,
        "folderId",
      ],
      description: "Receive notifications for tasks in a folder and, optionally, in its subfolders. Leave blank to receive notifications for all tasks in the account",
      optional: true,
      reloadProps: true,
    },
    spaceId: {
      propDefinition: [
        base.props.wrike,
        "spaceId",
      ],
      description: "Receive notifications for changes to tasks, folders, and projects within a space. Leave blank to receive notifications for all tasks in the account",
      optional: true,
      reloadProps: true,
    },
    recursive: {
      type: "boolean",
      label: "Recursive",
      description: "Specifies whether hook should listen to events for subfolders or tasks anywhere in the hierarchy. Defaults to `false`",
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving historical events...");
      const tasks = await this.wrike.listTasks({
        folderId: this.folder,
        spaceId: this.spaceId,
        params: {
          sortOrder: "desc",
          limit: constants.DEPLOY_LIMIT,
        },
      });
      for (const task of tasks.reverse()) {
        this.emitEvent(task);
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
      this.emitEvent(task);
    }
  },
};
