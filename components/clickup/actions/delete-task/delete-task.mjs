import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-delete-task",
  name: "Delete Task",
  description: "Delete a task. See the docs [here](https://clickup.com/api) in **Tasks / Delete Task** section.",
  version: "0.0.9",
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

    const response = await this.clickup.deleteTask({
      $,
      taskId,
      params,
    });

    $.export("$summary", "Successfully deleted task");

    return response;
  },
};
