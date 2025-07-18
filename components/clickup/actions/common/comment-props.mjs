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
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folderId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      optional: true,
    },
    listId: {
      propDefinition: [
        common.props.clickup,
        "listId",
        (c) => ({
          folderId: c.folderId,
          spaceId: c.spaceId,
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
    commentId: {
      propDefinition: [
        common.props.clickup,
        "commentId",
        (c) => ({
          taskId: c.taskId,
          listId: c.listId,
        }),
      ],
    },
  },
};
