import common from "./space-props.mjs";

export default {
  props: {
    ...common.props,
    folderId: {
      propDefinition: [
        common.props.clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
  },
};
