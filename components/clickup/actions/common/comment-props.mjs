import common from "./workspace-prop.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

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
      viewId: propsFragments.viewId,
      commentId: propsFragments.commentId,
    },
  }),
};
