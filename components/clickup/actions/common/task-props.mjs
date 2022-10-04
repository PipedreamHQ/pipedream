import common from "./list-props.mjs";

export default {
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.clickup,
        "lists",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
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
