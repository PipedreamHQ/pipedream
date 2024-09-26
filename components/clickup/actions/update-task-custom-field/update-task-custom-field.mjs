import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-update-task-custom-field",
  name: "Update Task Custom Field",
  description: "Update custom field value of a task. See the docs [here](https://clickup.com/api) in **Custom Fields / Set Custom Field Value** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    value: {
      label: "Value",
      type: "any",
      description: "The value of custom field",
    },
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
      value,
    } = this;

    const params = this.clickup.getParamsForCustomTaskIdCall(
      this.useCustomTaskIds,
      this.authorizedTeamId,
    );

    const response = await this.clickup.updateTaskCustomField({
      $,
      taskId,
      customFieldId,
      data: {
        value,
      },
      params,
    });

    $.export("$summary", "Successfully updated custom field of task");

    return response;
  },
};
