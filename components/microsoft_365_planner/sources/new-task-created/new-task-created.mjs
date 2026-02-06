import common from "../common/common.mjs";

export default {
  ...common,
  key: "microsoft_365_planner-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new Task is created in Microsoft 365 Planner",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    groupId: {
      propDefinition: [
        common.props.microsoft365Planner,
        "groupId",
      ],
    },
    planId: {
      propDefinition: [
        common.props.microsoft365Planner,
        "planId",
        (c) => ({
          groupId: c.groupId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.microsoft365Planner.listTasks;
    },
    getArgs() {
      return {
        planId: this.planId,
      };
    },
    generateMeta(task) {
      return {
        id: task.id,
        summary: task.title,
        ts: Date.parse(task.createdDateTime),
      };
    },
  },
};
