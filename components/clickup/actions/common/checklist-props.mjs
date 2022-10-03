import common from "./task-props.mjs";

export default {
  props: {
    ...common.props,
    checklistId: {
      propDefinition: [
        common.props.clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
    },
  },
};
