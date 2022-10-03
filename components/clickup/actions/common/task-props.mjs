import clickup from "../../clickup.app.mjs";

export default {
  props: {
    clickup,
    workspaceId: {
      propDefinition: [
        clickup,
        "workspaces",
      ],
    },
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      description: "If selected, the **Lists** will be filtered by this Space ID",
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
      description: "If selected, the **Lists** will be filtered by this Folder ID",
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
    },
    taskId: {
      propDefinition: [
        clickup,
        "tasks",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
};
