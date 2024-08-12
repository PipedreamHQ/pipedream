import common from "../common/task-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-get-task",
  name: "Get Task",
  description: "Get a task. See the docs [here](https://clickup.com/api) in **Tasks / Get Task** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
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

    const response = await this.clickup.getTask({
      $,
      taskId,
      params,
    });

    $.export("$summary", "Successfully retrieved task");

    return response;
  },
};
