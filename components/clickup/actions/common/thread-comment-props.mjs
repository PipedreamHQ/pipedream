import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
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
  },
  additionalProps: builder.buildListProps({
    tailProps: {
      taskId: propsFragments.taskId,
      commentId: propsFragments.commentId,
    },
  }),
};
