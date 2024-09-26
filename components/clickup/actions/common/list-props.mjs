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
    },
  },
};
