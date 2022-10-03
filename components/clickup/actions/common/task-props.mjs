import common from "./list-props.mjs";

export default {
  props: {
    ...common.props,
    taskId: {
      propDefinition: [
        common.props.clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
};
