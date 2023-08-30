import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "microsofttodo-new-task-created",
  name: "New Task Created (Instant)",
  description: "Emit new event when a new task is created in a list.",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    taskListId: {
      propDefinition: [
        common.props.microsoftOutlook,
        "taskListId",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        changeType: "created",
        resource: `/me/todo/lists/${this.taskListId}/tasks`,
      });
    },
    async deactivate() {
      await this.deactivate();
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      return this.microsoftOutlook.listTasks({
        taskListId: this.taskListId,
      });
    },
    generateMeta(item) {
      return {
        id: item.id.slice(-64),
        summary: item.title,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
  async run(event) {
    await this.run({
      event,
      emitFn: async ({ resourceId } = {}) => {
        const item = await this.microsoftOutlook.getTask({
          taskListId: this.taskListId,
          taskId: resourceId,
        });
        this.emitEvent(item);
      },
    });
  },
};
