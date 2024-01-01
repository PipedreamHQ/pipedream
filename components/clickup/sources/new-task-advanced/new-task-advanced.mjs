import common from "../common/common.mjs";

export default {
  ...common,
  key: "clickup-new-task-advanced",
  name: "New Task Advanced (Instant)",
  description: "Emit new event when a new task is created matching the filter",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        common.props.app,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      description: "If selected, the **Lists** will be filtered by this Space ID",
      optional: true,
    },
    folderId: {
      propDefinition: [
        common.props.app,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      description: "If selected, the **Lists** will be filtered by this Folder ID",
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    _getMeta({ task_id: taskId }) {
      return {
        id: taskId,
        summary: String(taskId),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "taskCreated",
      ];
    },
    getTask({ task_id: taskId }) {
      return this.app.getTask({
        taskId,
      });
    },
    eventFilter(task) {
      let filter = true;
      if (this.listId && task.list.id !== this.listId) {
        filter = false;
      }
      if (this.folderId && task.folder.id !== this.folderId) {
        filter = false;
      }
      if (this.spaceId && task.space.id !== this.spaceId) {
        filter = false;
      }
      return filter;
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);
    const task = await this.getTask(httpRequest.body);
    if (this.eventFilter(task)) {
      this.$emit({
        ...httpRequest.body,
        task,
      }, this._getMeta(httpRequest.body));
    }
  },
};
