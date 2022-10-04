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
      description: "If selected, the **Lists** will be filtered by this Space ID",
      optional: true,
    },
    folderId: {
      propDefinition: [
        common.props.clickup,
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
        common.props.clickup,
        "lists",
        (c) => ({
          workspaceId: c.workspaceId,
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
    },
  },
};
