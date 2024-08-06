import common from "../common/common.mjs";
import builder from "../../common/builder.mjs";

export default {
  ...common,
  key: "clickup-new-task-advanced",
  name: "New Task Advanced (Instant)",
  description: "Emit new event when a new task is created matching the filter",
  version: "0.0.5",
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
    },
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.app,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
  }),
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
