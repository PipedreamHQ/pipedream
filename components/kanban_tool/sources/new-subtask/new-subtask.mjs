import common from "../common/common.mjs";

export default {
  ...common,
  key: "kanban_tool-new-subtask",
  name: "New Subtask(Checklist Item) Created Event",
  description: "Emit new events when a new subtask is created on selected task. [See the docs](https://kanbantool.com/developer/api-v3#fetching-tasks-details)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    boardId: {
      propDefinition: [
        common.props.app,
        "boardId",
      ],
    },
    taskId: {
      propDefinition: [
        common.props.app,
        "taskId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getTask,
        resourceKey: "subtasks",
        resourceFnArgs: {
          taskId: this.taskId,
        },
        pagingCfg: {
          noPaging: true,
        },
      };
    },
    getComparable(item) {
      return new Date(item.created_at).getTime();
    },
    getMeta(item) {
      return {
        id: item?.id,
        summary: `New subtask created: ${item.name}(ID: ${item.id})`,
        ts: new Date(item?.created_at).getTime(),
      };
    },
  },
};
