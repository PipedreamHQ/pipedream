import common from "./task-props.mjs";

export default {
  props: {
    ...common.props,
    taskId: {
      ...common.props.taskId,
      optional: true,
    },
    checklistId: {
      propDefinition: [
        common.props.clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
      description: "To show options please select a **Task** first",
    },
  },
};
