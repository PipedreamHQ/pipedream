import common from "./list-props.mjs";

export default {
  props: {
    ...common.props,
    listId: {
      ...common.props.listId,
      optional: true,
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
      description: "To show options please select a **List** first",
    },
  },
};
