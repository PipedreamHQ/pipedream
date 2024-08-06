import common from "../common/task-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-get-task-comments",
  name: "Get Task Comments",
  description: "Get a task comments. See the docs [here](https://clickup.com/api) in **Comments / Get Task Comments** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
    tailProps: {
      taskId: {
        ...propsFragments.taskId,
        description: "To show options please select a **List** first",
      },
    },
  }),
  async run({ $ }) {
    const { taskId } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.getTaskComments({
      $,
      taskId,
      params,
    });

    $.export("$summary", "Successfully retrieved task comments");

    return response;
  },
};
