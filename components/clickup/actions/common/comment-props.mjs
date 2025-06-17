import common from "./workspace-prop.mjs";

export default {
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        common.props.clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        common.props.clickup,
        "taskId",
        (c) => ({
          listId: c.listId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
    },
    viewId: {
      propDefinition: [
        common.props.clickup,
        "viewId",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
          listId: c.listId,
        }),
      ],
    },
    commentId: {
      propDefinition: [
        common.props.clickup,
        "commentId",
        (c) => ({
          taskId: c.taskId,
          listId: c.listId,
          viewId: c.viewId,
        }),
      ],
    },
  },
};
