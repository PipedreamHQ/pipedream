import common from "../common/task-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-remove-task-custom-field",
  name: "Remove Task Custom Field",
  description: "Remove custom field from a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Remove Custom Field Value** section.",
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
      customFieldId: propsFragments.customFieldId,
    },
  }),
  async run({ $ }) {
    const {
      taskId,
      customFieldId,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.removeTaskCustomField({
      $,
      taskId,
      customFieldId,
      params,
    });

    $.export("$summary", "Successfully removed custom field of task");

    return response;
  },
};
